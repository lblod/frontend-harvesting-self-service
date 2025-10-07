import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import config from 'frontend-harvesting-self-service/config/environment';
export default class JobTasklistController extends Controller {
  @service router;

  page = 0;
  sort = '-created';
  size = 15;

  @tracked job;

  get hideDeleteJobButton() {
    return ['true', 'True', 'TRUE', true].includes(
      config.harvester.hideDeleteJobButton,
    );
  }

  @action
  reload() {
    this.router.refresh('job.tasklist');
  }

  deleteJob = task(async (job) => {
    //Delete top level down the tree, less confusing if something fails.

    //NOTE: Even though inputContainers & resultsContainers have the same nested structure, I duplicated the code since I know you like the seperation more then a wrapping |for| loop
    const tasks = await job.tasks;
    await job.destroyRecord();

    for (const task of tasks) {
      const iContainers = await task.inputContainers;
      const rContainers = await task.resultsContainers;
      await task.destroyRecord();

      for (const input of iContainers) {
        const fileList = await input.files;
        const collectionList = await input.harvestingCollections;
        await input.destroyRecord();

        for (const file of fileList) {
          //NOTE: file model gets found but cannot get physical file in backend to delete
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

      for (const result of rContainers) {
        const fileList = await result.files;
        const collectionList = await result.harvestingCollections;
        await result.destroyRecord();

        for (const file of fileList) {
          //NOTE: file model gets found but cannot get physical file in backend to delete
          await file.destroyRecord();
        }

        for (const collection of collectionList) {
          const rObjs = await collection.remoteDataObjects;
          await collection.destroyRecord();

          //NOTE: Pretty sure this should get deleted after the file issue is resolved
          for (const rObj of rObjs) {
            await rObj.destroyRecord();
          }
        }
      }
    }
    this.router.transitionTo('overview.jobs');
  });
}
