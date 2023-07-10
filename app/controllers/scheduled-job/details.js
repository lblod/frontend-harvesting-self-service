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
      return cronstrue.toString(this.frequency, {
        use24HourTimeFormat: true,
      });
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

    // NOTE : Modified the code to delete from bottom to top because currently
    // there is no deletion of the authenticationConfiguration and
    // informations attached(securityScheme and credential). We need
    // to get this deleted because it shouldn't stay in the db even
    // if the job is deleted
    const scheduledTasks = yield this.job.scheduledTasks;
    yield this.deleteTaskAndAllRelatedData.perform(scheduledTasks);
    yield this.job.destroyRecord();
    this.router.transitionTo('overview.scheduled-jobs');
  }

  @task
  *deleteTaskAndAllRelatedData(tasks) {
    for (const task of tasks) {
      const inputContainers = yield task.inputContainers;
      yield this.deleteInputContainersAndAllRelatedData.perform(
        inputContainers
      );
      yield task.destroyRecord();
    }
  }

  @task
  *deleteInputContainersAndAllRelatedData(inputContainers) {
    for (const input of inputContainers) {
      const fileList = yield input.files;
      const collectionList = yield input.harvestingCollections;

      for (const file of fileList) {
        //NOTE: file model gets found but cannot get physical file in backend
        // to delete
        yield file.destroyRecord();
      }

      yield this.deleteCollectionsAndAllRelatedData.perform(collectionList);
      yield input.destroyRecord();
    }
  }

  @task
  *deleteCollectionsAndAllRelatedData(collections) {
    for (const collection of collections) {
      const rObjs = yield collection.remoteDataObjects;
      const authConfigObj = yield collection.authenticationConfiguration;

      if (authConfigObj) {
        const credential = yield authConfigObj.credential;
        const scheme = yield authConfigObj.securityScheme;

        yield credential.destroyRecord();

        yield scheme.destroyRecord();

        yield authConfigObj.destroyRecord();
      }

      for (const rObj of rObjs) {
        yield rObj.destroyRecord();
      }

      yield collection.destroyRecord();
    }
  }
}
