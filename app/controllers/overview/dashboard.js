import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { differenceInDays, format } from 'date-fns';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';
import { JOB_OP_STATUS_SUCCESS } from '../../utils/constants';

const SUCCESS = JOB_OP_STATUS_SUCCESS;
const OP_DELTA =
  'http://lblod.data.gift/id/jobs/concept/TaskOperation/generatingDelta';

const QUERY_SCHEDULED_JOBS = `
SELECT ?schedJob (MIN(?schedTitle) as ?schedTitle) (MIN(?schedule) as ?schedule) WHERE {
  ?schedJob a <http://vocab.deri.ie/cogs#ScheduledJob> ;
    <http://purl.org/dc/terms/title> ?schedTitle .
  OPTIONAL {
    ?schedJob <http://redpencil.data.gift/vocabularies/tasks/schedule> ?cronSchedule .
    ?cronSchedule <http://schema.org/repeatFrequency> ?schedule .
  }
} GROUP BY ?schedJob
`;

const QUERY_LAST_SUCCESS = `
SELECT ?schedJob (MAX(?modified) as ?lastSuccess) WHERE {
  ?job a <http://vocab.deri.ie/cogs#Job> ;
    <http://purl.org/dc/terms/creator> ?schedJob ;
    <http://www.w3.org/ns/adms#status> <${SUCCESS}> ;
    <http://purl.org/dc/terms/modified> ?modified .
} GROUP BY ?schedJob
`;

const QUERY_DELTA_STATS = `
SELECT ?schedJob (COUNT(?deltaFile) as ?deltaCount) (MIN(?created) as ?oldestDelta) (MAX(?created) as ?latestDelta) WHERE {
  ?job a <http://vocab.deri.ie/cogs#Job> ;
    <http://purl.org/dc/terms/creator> ?schedJob .
  ?deltaTask <http://purl.org/dc/terms/isPartOf> ?job ;
    <http://redpencil.data.gift/vocabularies/tasks/operation> <${OP_DELTA}> ;
    <http://redpencil.data.gift/vocabularies/tasks/resultsContainer> ?container .
  ?container <http://redpencil.data.gift/vocabularies/tasks/hasFile> ?deltaFile .
  ?deltaFile <http://purl.org/dc/terms/created> ?created .
} GROUP BY ?schedJob
`;

const QUERY_LATEST_FULL_DATASET = `
SELECT (MAX(?modified) as ?latestFullDataset) WHERE {
  ?dist a <http://www.w3.org/ns/dcat#Distribution> ;
    <http://purl.org/dc/terms/modified> ?modified .
}
`;

function stalenessLabel(days) {
  if (days === null) return 'N/A';
  if (days === 0) return 'Today';
  return `${days}d ago`;
}

function stalenessStatus(days) {
  if (days === null || days > 30) return 'failed';
  if (days > 7) return 'busy';
  return 'success';
}

export default class OverviewDashboardController extends Controller {
  @service sparql;

  @tracked jobs = [];
  @tracked sortColumn = 'lastRun';
  @tracked sortDir = 'desc';
  @tracked totalDeltaFiles = 0;
  @tracked oldestDelta = null;
  @tracked newestDelta = null;
  @tracked latestFullDataset = null;
  @tracked lastRefreshed = null;

  get sortedJobs() {
    const { sortColumn, sortDir } = this;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...this.jobs].sort((a, b) => {
      switch (sortColumn) {
        case 'title':
          return dir * a.title.localeCompare(b.title);
        case 'lastRun': {
          if (a.daysSinceSuccess === null && b.daysSinceSuccess === null)
            return 0;
          // nulls sort to whichever end represents "most stale"
          if (a.daysSinceSuccess === null) return dir;
          if (b.daysSinceSuccess === null) return -dir;
          return dir * (a.daysSinceSuccess - b.daysSinceSuccess);
        }
        case 'nextRun':
          if (!a.nextRun && !b.nextRun) return 0;
          if (!a.nextRun) return 1;
          if (!b.nextRun) return -1;
          return dir * (a.nextRun - b.nextRun);
        default:
          return 0;
      }
    });
  }

  @action
  refresh() {
    this.loadData.perform();
  }

  @action
  sortBy(column) {
    if (this.sortColumn === column) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDir = column === 'nextRun' ? 'asc' : 'desc';
    }
  }

  loadData = task(async () => {
    const [schedJobRows, lastSuccessRows, deltaRows, fullDatasetRows] =
      await Promise.all([
        this.sparql.query(QUERY_SCHEDULED_JOBS),
        this.sparql.query(QUERY_LAST_SUCCESS),
        this.sparql.query(QUERY_DELTA_STATS),
        this.sparql.query(QUERY_LATEST_FULL_DATASET),
      ]);

    const lastSuccessMap = new Map(
      lastSuccessRows.map((r) => [
        r.schedJob.value,
        new Date(r.lastSuccess.value),
      ]),
    );

    const deltaMap = new Map(
      deltaRows.map((r) => [
        r.schedJob.value,
        {
          count: parseInt(r.deltaCount.value, 10),
          oldest: new Date(r.oldestDelta.value),
          latest: new Date(r.latestDelta.value),
        },
      ]),
    );

    const now = new Date();
    this.jobs = schedJobRows.map((r) => {
      const uri = r.schedJob.value;
      const id = uri.split('/').pop();
      const lastSuccess = lastSuccessMap.get(uri) ?? null;
      const delta = deltaMap.get(uri) ?? null;
      const days = lastSuccess ? differenceInDays(now, lastSuccess) : null;

      let scheduleDescription = null;
      let nextRun = null;
      if (r.schedule?.value) {
        try {
          scheduleDescription = cronstrue.toString(r.schedule.value, {
            use24HourTimeFormat: true,
          });
          nextRun = CronExpressionParser.parse(r.schedule.value)
            .next()
            .toDate();
        } catch {
          scheduleDescription = r.schedule.value;
        }
      }

      return {
        uri,
        id,
        title: r.schedTitle.value,
        schedule: r.schedule?.value ?? null,
        scheduleDescription,
        lastSuccess,
        deltaCount: delta?.count ?? 0,
        deltaCountFormatted: (delta?.count ?? 0).toLocaleString(),
        latestDelta: delta?.latest ?? null,
        daysSinceSuccess: days,
        stalenessLabel: stalenessLabel(days),
        lastSuccessFormatted: lastSuccess
          ? format(lastSuccess, 'dd/MM/yyyy HH:mm')
          : null,
        stalenessStatus: stalenessStatus(days),
        nextRun,
      };
    });

    const allDeltas = [...deltaMap.values()];
    this.totalDeltaFiles = allDeltas
      .reduce((sum, d) => sum + d.count, 0)
      .toLocaleString();

    const oldestDates = allDeltas.map((d) => d.oldest).filter(Boolean);
    this.oldestDelta = oldestDates.length
      ? new Date(Math.min(...oldestDates))
      : null;

    const latestDates = allDeltas.map((d) => d.latest).filter(Boolean);
    this.newestDelta = latestDates.length
      ? new Date(Math.max(...latestDates))
      : null;

    const fullDatasetValue = fullDatasetRows[0]?.latestFullDataset?.value;
    this.latestFullDataset = fullDatasetValue
      ? new Date(fullDatasetValue)
      : null;

    this.lastRefreshed = new Date();
  });
}
