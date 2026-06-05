import Controller from '@ember/controller';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import cronstrue from 'cronstrue';

const SUCCESS = 'http://redpencil.data.gift/id/concept/JobStatus/success';
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
  if (days === null) return 'Never run';
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
  @tracked totalDeltaFiles = 0;
  @tracked oldestDelta = null;
  @tracked newestDelta = null;
  @tracked latestFullDataset = null;

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
    this.jobs = schedJobRows
      .map((r) => {
        const uri = r.schedJob.value;
        const id = uri.split('/').pop();
        const lastSuccess = lastSuccessMap.get(uri) ?? null;
        const delta = deltaMap.get(uri) ?? null;
        const days = lastSuccess ? differenceInDays(now, lastSuccess) : null;

        let scheduleDescription = null;
        if (r.schedule?.value) {
          try {
            scheduleDescription = cronstrue.toString(r.schedule.value, {
              use24HourTimeFormat: true,
            });
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
          lastSuccessRelative: lastSuccess
            ? formatDistanceToNow(lastSuccess, { addSuffix: true })
            : null,
          deltaCount: delta?.count ?? 0,
          deltaCountFormatted: (delta?.count ?? 0).toLocaleString(),
          latestDelta: delta?.latest ?? null,
          daysSinceSuccess: days,
          stalenessLabel: stalenessLabel(days),
          stalenessStatus: stalenessStatus(days),
        };
      })
      .sort((a, b) => {
        if (a.daysSinceSuccess === null && b.daysSinceSuccess === null)
          return 0;
        if (a.daysSinceSuccess === null) return -1;
        if (b.daysSinceSuccess === null) return 1;
        return b.daysSinceSuccess - a.daysSinceSuccess;
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
  });
}
