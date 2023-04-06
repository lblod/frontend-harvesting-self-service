import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

export default class JobTasklistController extends Controller {
  @service router;

  @tracked page = 0;
  @tracked sort = 'created';
  @tracked size = 15;
  @tracked job;

  sort = '-index';
  page = 0;
  size = 15;

  @task
  *deleteJob(job) {
    //Delete top level down the tree, less confusing if something fails.

    //NOTE: Even though inputContainers & resultsContainers have the same nested structure, I duplicated the code since I know you like the seperation more then a wrapping |for| loop
    const tasks = yield job.tasks;
    yield job.destroyRecord();

    for (const task of tasks) {
      const iContainers = yield task.inputContainers;
      const rContainers = yield task.resultsContainers;
      yield task.destroyRecord();

      for (const input of iContainers) {
        const fileList = yield input.files;
        const collectionList = yield input.harvestingCollections;
        yield input.destroyRecord();

        for (const file of fileList) {
          //NOTE: file model gets found but cannot get physical file in backend to delete
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

      for (const result of rContainers) {
        const fileList = yield result.files;
        const collectionList = yield result.harvestingCollections;
        yield result.destroyRecord();

        for (const file of fileList) {
          //NOTE: file model gets found but cannot get physical file in backend to delete
          yield file.destroyRecord();
        }

        for (const collection of collectionList) {
          const rObjs = yield collection.remoteDataObjects;
          yield collection.destroyRecord();

          //NOTE: Pretty sure this should get deleted after the file issue is resolved
          for (const rObj of rObjs) {
            yield rObj.destroyRecord();
          }
        }
      }
    }
    this.router.transitionTo('overview.jobs');
  }
}
