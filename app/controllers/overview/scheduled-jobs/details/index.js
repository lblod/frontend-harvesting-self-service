import Controller from '@ember/controller';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import cronstrue from 'cronstrue';

export default class OverviewScheduledJobsDetailsIndexController extends Controller {
  @service router;

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
