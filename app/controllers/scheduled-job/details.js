import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import cronstrue from 'cronstrue';

export default class ScheduledJobDetailsController extends Controller {
  @tracked sort = '-created';
  @tracked page = 0;
  @tracked job;

  @service router;

  size = 15;

  queryParams = ['page', 'size', 'sort'];

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
    //Delete top level down the tree, less confusing if something fails.

    //NOTE: Even though inputContainers & resultsContainers have the same
    //nested structure, I duplicated the code since I know you like the
    //seperation more then a wrapping |for| loop
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
          //NOTE: file model gets found but cannot get physical file in backend
          //to delete
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
