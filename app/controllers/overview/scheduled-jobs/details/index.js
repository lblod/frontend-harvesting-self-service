import Controller from '@ember/controller';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';

const OP_DELTA =
  'http://lblod.data.gift/id/jobs/concept/TaskOperation/generatingDelta';
const SUCCESS = 'http://redpencil.data.gift/id/concept/JobStatus/success';

export default class OverviewScheduledJobsDetailsIndexController extends Controller {
  @service router;
  @service sparql;

  @tracked deltaStats = null;
  @tracked lastSuccessDate = null;
  @tracked lastSuccessDuration = null;

  get job() {
    return this.model;
  }

  get frequency() {
    return this.job.schedule?.get('repeatFrequency');
  }

  get cronDescription() {
    if (this.frequency) {
      return cronstrue.toString(this.frequency, {
        use24HourTimeFormat: true,
      });
    } else {
      return '';
    }
  }

  get nextRun() {
    if (!this.frequency) return null;
    try {
      return CronExpressionParser.parse(this.frequency).next().toDate();
    } catch {
      return null;
    }
  }

  loadDeltaStats = task(async () => {
    const uri = this.job.uri;
    if (!uri) return;

    const [deltaRows, successRows] = await Promise.all([
      this.sparql.query(`
        SELECT (COUNT(?deltaFile) as ?deltaCount) (MIN(?created) as ?earliest) (MAX(?created) as ?latest) WHERE {
          ?job a <http://vocab.deri.ie/cogs#Job> ;
            <http://purl.org/dc/terms/creator> <${uri}> .
          ?deltaTask <http://purl.org/dc/terms/isPartOf> ?job ;
            <http://redpencil.data.gift/vocabularies/tasks/operation> <${OP_DELTA}> ;
            <http://redpencil.data.gift/vocabularies/tasks/resultsContainer> ?container .
          ?container <http://redpencil.data.gift/vocabularies/tasks/hasFile> ?deltaFile .
          ?deltaFile <http://purl.org/dc/terms/created> ?created .
        }
      `),
      this.sparql.query(`
        SELECT ?created ?modified WHERE {
          ?job a <http://vocab.deri.ie/cogs#Job> ;
            <http://purl.org/dc/terms/creator> <${uri}> ;
            <http://www.w3.org/ns/adms#status> <${SUCCESS}> ;
            <http://purl.org/dc/terms/created> ?created ;
            <http://purl.org/dc/terms/modified> ?modified .
          FILTER NOT EXISTS {
            ?laterJob a <http://vocab.deri.ie/cogs#Job> ;
              <http://purl.org/dc/terms/creator> <${uri}> ;
              <http://www.w3.org/ns/adms#status> <${SUCCESS}> ;
              <http://purl.org/dc/terms/modified> ?laterModified .
            FILTER(?laterModified > ?modified)
          }
        }
      `),
    ]);

    const dr = deltaRows[0];
    const count = parseInt(dr?.deltaCount?.value ?? '0', 10);
    this.deltaStats =
      count > 0
        ? {
            count: count.toLocaleString(),
            earliest: dr.earliest?.value ? new Date(dr.earliest.value) : null,
            latest: dr.latest?.value ? new Date(dr.latest.value) : null,
          }
        : { count: '0', earliest: null, latest: null };

    const sr = successRows[0];
    const created = sr?.created?.value ? new Date(sr.created.value) : null;
    const modified = sr?.modified?.value ? new Date(sr.modified.value) : null;
    this.lastSuccessDate = modified;
    if (created && modified) {
      const ms = modified - created;
      const totalMinutes = Math.round(ms / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      this.lastSuccessDuration =
        hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    } else {
      this.lastSuccessDuration = null;
    }
  });

  deleteJob = task(async () => {
    const scheduledTasks = await this.job.scheduledTasks;
    await this.job.destroyRecord();

    for (const task of scheduledTasks) {
      const iContainers = await task.inputContainers;
      await task.destroyRecord();

      for (const input of iContainers) {
        const fileList = await input.files;
        const collectionList = await input.harvestingCollections;
        await input.destroyRecord();

        for (const file of fileList) {
          await file.destroyRecord();
        }

        for (const collection of collectionList) {
          const rObjs = await collection.remoteDataObjects;
          await collection.destroyRecord();

          for (const rObj of rObjs) {
            await rObj.destroyRecord();
          }
        }
      }
    }
    this.router.transitionTo('overview.scheduled-jobs');
  });
}
