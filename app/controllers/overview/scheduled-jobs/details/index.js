import Controller from '@ember/controller';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';

const SUCCESS = 'http://redpencil.data.gift/id/concept/JobStatus/success';

const STATUS_MAP = {
  'http://redpencil.data.gift/id/concept/JobStatus/success': 'success',
  'http://redpencil.data.gift/id/concept/JobStatus/failed': 'failed',
  'http://redpencil.data.gift/id/concept/JobStatus/busy': 'busy',
  'http://redpencil.data.gift/id/concept/JobStatus/scheduled': 'scheduled',
  'http://redpencil.data.gift/id/concept/JobStatus/canceled': 'canceled',
};

export default class OverviewScheduledJobsDetailsIndexController extends Controller {
  @service router;
  @service sparql;

  @tracked lastSuccessDate = null;
  @tracked lastJobStatus = null;
  @tracked lastJobDate = null;

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

    const [successRows, statusRows] = await Promise.all([
      this.sparql.query(`
        SELECT (MAX(?modified) as ?lastSuccess) WHERE {
          ?job a <http://vocab.deri.ie/cogs#Job> ;
            <http://purl.org/dc/terms/creator> <${uri}> ;
            <http://www.w3.org/ns/adms#status> <${SUCCESS}> ;
            <http://purl.org/dc/terms/modified> ?modified .
        }
      `),
      this.sparql.query(`
        SELECT ?status ?modified WHERE {
          ?job a <http://vocab.deri.ie/cogs#Job> ;
            <http://purl.org/dc/terms/creator> <${uri}> ;
            <http://www.w3.org/ns/adms#status> ?status ;
            <http://purl.org/dc/terms/modified> ?modified .
        } ORDER BY DESC(?modified) LIMIT 1
      `),
    ]);

    this.lastSuccessDate = successRows[0]?.lastSuccess?.value
      ? new Date(successRows[0].lastSuccess.value)
      : null;

    const statusUri = statusRows[0]?.status?.value;
    this.lastJobStatus = statusUri ? (STATUS_MAP[statusUri] ?? null) : null;
    this.lastJobDate = statusRows[0]?.modified?.value
      ? new Date(statusRows[0].modified.value)
      : null;
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
