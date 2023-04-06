import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import cronstrue from 'cronstrue';

export default class ScheduledJobDetailsController extends Controller {
  sort = '-created';
  page = 0;
  size = 15;

  @tracked job;

  @service router;

  get frequency() {
    return this.job.schedule?.get('repeatFrequency');
  }

  get cronDescription() {
    if (this.frequency) {
      return cronstrue.toString(this.frequency);
    } else {
      return '';
    }
  }

  @task
  *deleteJob() {
    //Delete top level down the tree, less confusing if something fails.

    //NOTE: Even though inputContainers & resultsContainers have the same
    //nested structure, I duplicated the code since I know you like the
    //seperation more then a wrapping |for| loop
    const scheduledTasks = yield this.job.scheduledTasks;
    yield this.job.destroyRecord();

    for (const task of scheduledTasks) {
      const iContainers = yield task.inputContainers;
      yield task.destroyRecord();

      for (const input of iContainers) {
        const fileList = yield input.files;
        const collectionList = yield input.harvestingCollections;
        yield input.destroyRecord();

        for (const file of fileList) {
          //NOTE: file model gets found but cannot get physical file in backend
          //to delete
          yield file.destroyRecord();
        }

        for (const collection of collectionList) {
          const rObjs = yield collection.remoteDataObjects;
          yield collection.destroyRecord();

          for (const rObj of rObjs) {
            yield rObj.destroyRecord();
          }
        }
      }
    }
    this.router.transitionTo('overview.scheduled-jobs');
  }
}
