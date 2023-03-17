import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { isValidCron } from 'cron-validator';
import cronstrue from 'cronstrue';
import { service } from "@ember/service";

export default class ScheduledJobsDetailsController extends Controller {
  @service router;
  queryParams = ['editing'];

  @tracked editing = false;
  @tracked editError = false;

  // Edit Popup fields
  @tracked newTitle;
  @tracked newComment;
  @tracked newCronPattern;

  get title() {
    return this.model.title;
  }

  get frequency() {
    return this.model.schedule?.get('repeatFrequency');
  }

  get currentCronDescription() {
    if (this.frequency) {
      return cronstrue.toString(this.frequency);
    } else {
      return '';
    }
  }

  get newCronDescription() {
    const isValidCronExpression = isValidCron(this.newCronPattern);

    if (isValidCronExpression) {
      return cronstrue.toString(this.newCronPattern, {
        use24HourTimeFormat: true,
      });
    } else {
      return 'This is not a valid cron pattern';
    }
  }

  get editContainsUnsavedChanges() {
    return (
      this.title !== this.newTitle || this.frequency !== this.newCronPattern
    );
  }

  get isValidEdit() {
    return (
      this.editContainsUnsavedChanges &&
      this.newTitle &&
      isValidCron(this.newCronPattern)
    );
  }

  @action
  closeEdit() {
    const askForUserConfirmation = () =>
      this.editContainsUnsavedChanges &&
      confirm('Unsaved changes,\nare you sure to cancel this action?');
    if (!this.editContainsUnsavedChanges || askForUserConfirmation()) {
      this.editError = false;
      this.newTitle = this.title || '';
      this.newCronPattern = this.frequency || '*/5 * * * *';
      this.editing = false;
    }
  }

  @task
  *deleteJob(scheduledJob) {
    //Delete top level down the tree, less confusing if something fails.

    //NOTE: Even though inputContainers & resultsContainers have the same nested structure, I duplicated the code since I know you like the seperation more then a wrapping |for| loop
    const scheduledTasks = yield scheduledJob.scheduledTasks;
    yield scheduledJob.destroyRecord();

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
    this.router.transitionTo('scheduled-jobs.index');
  }

  @task
  *update(scheduledJob) {
    if (!this.editContainsUnsavedChanges) return (this.editing = false);

    const modified = new Date();
    const currentSchedule = yield scheduledJob.schedule;

    const shouldUpdateTitle = this.title !== this.newTitle;
    const shouldUpdateFrequency = this.frequency !== this.newCronPattern;

    const saveScheduledJob = async () => {
      await scheduledJob.set('modified', modified);
      await scheduledJob.save().then(
        () => {
          this.editing = false;
          this.editError = false;
        },
        (e) => {
          scheduledJob.rollbackAttributes();
          this.editError = e;
        }
      );
    };

    if (shouldUpdateTitle) {
      yield scheduledJob.set('title', this.newTitle);
    }

    if (shouldUpdateFrequency) {
      yield currentSchedule.set('repeatFrequency', this.newCronPattern);
      yield currentSchedule.save().then(
        async () => {
          await saveScheduledJob();
        },
        (e) => {
          currentSchedule.rollbackAttributes();
          this.editError = e;
        }
      );
    } else {
      yield saveScheduledJob();
    }
  }
}
