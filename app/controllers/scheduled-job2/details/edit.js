import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isValidCron } from 'cron-validator';
import { task } from 'ember-concurrency-decorators';
import { service } from '@ember/service';
import cronstrue from 'cronstrue';

export default class ScheduledJob2DetailsEditController extends Controller {
  @tracked job;

  // Edit Popup fields
  @tracked newTitle;
  @tracked newTitleValid;
  @tracked newCronPattern;
  @tracked newCronPatternValid;

  @service toaster;
  @service router;

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

  //get editContainsUnsavedChanges() {
  //  return (
  //    this.job.title !== this.newTitle ||
  //    this.job.schedule?.get('repeatFrequency') !== this.newCronPattern
  //  );
  //}

  //@action
  //closeEdit() {
  //  const askForUserConfirmation = () =>
  //    this.editContainsUnsavedChanges &&
  //    confirm('Unsaved changes,\nare you sure to cancel this action?');
  //  if (!this.editContainsUnsavedChanges || askForUserConfirmation()) {
  //    this.newTitle = this.model.title || '';
  //    this.newCronPattern = this.frequency || '*/5 * * * *';
  //  }
  //}
  
  @action
  cancelEditScheduledJob() {
    this.router.transitionTo('scheduled-job2.details');
  }

  get updatedTitle() {
    return this.job.title !== this.newTitle;
  }

  get updatedFrequency() {
    return this.job.get('schedule.frequency') !== this.newCronPattern;
  }

  @action
  validateForm() {
    this.newTitleValid = !!this.newTitle;
    this.newCronPatternValid =
      !!this.newCronPattern && isValidCron(this.newCronPattern);
    return this.newTitleValid && this.newCronPatternValid;
  }

  @task
  *update() {
    if (!this.validateForm()) return;
    try {
      const schedule = yield this.job.schedule;
      yield this.job.set('modified', new Date());
      if (this.updatedTitle) yield this.job.set('title', this.newTitle);
      yield this.job.save();

      if (this.updatedFrequency) {
        yield schedule.set('repeatFrequency', this.newCronPattern);
        yield schedule.save();
      }

      this.toaster.success('Changes to scheduled job saved', 'Save success', {
        icon: 'check',
        timeOut: 10000,
        closable: true,
      });
      this.router.transitionTo('scheduled-job2.details');
    } catch (err) {
      this.job.rollbackAttributes();
      const schedule = yield this.job.schedule;
      schedule.rollbackAttributes();

      this.toaster.error(
        `Error while saving changes to the scheduled job: (${err})`,
        'Saving failed',
        { icon: 'cross', timeOut: 10000, closable: true }
      );
    }
  }
}
