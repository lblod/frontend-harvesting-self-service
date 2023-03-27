import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import cronstrue from 'cronstrue';

export default class ScheduledJob2DetailsController extends Controller {
  sort = '-created';
  page = 0;
  size = 15;

  @tracked job;

  get frequency() {
    return this.job.schedule?.get('repeatFrequency');
  }

  get currentCronDescription() {
    if (this.frequency) {
      return cronstrue.toString(this.frequency);
    } else {
      return '';
    }
  }

  @task
  *deleteJob() {
    //Delete top level down the tree, less confusing if something fails.

    //NOTE: Even though inputContainers & resultsContainers have the same nested structure, I duplicated the code since I know you like the seperation more then a wrapping |for| loop
    const scheduledTasks = yield this.job.scheduledTasks;
    yield this.job.destroyRecord();

    for (let task of scheduledTasks.toArray()) {
      const iContainers = yield task.inputContainers;
      yield task.destroyRecord();

      for (let input of iContainers.toArray()) {
        const fileList = yield input.files;
        const collectionList = yield input.harvestingCollections;
        yield input.destroyRecord();

        for (let file of fileList.toArray()) {
          //NOTE: file model gets found but cannot get physical file in backend to delete
          yield file.destroyRecord();
        }

        for (let collection of collectionList.toArray()) {
          const rObjs = yield collection.remoteDataObjects;
          yield collection.destroyRecord();

          for (let rObj of rObjs.toArray()) {
            yield rObj.destroyRecord();
          }
        }
      }
    }
    this.router.transitionTo('overview.scheduled-jobs');
  }
}
