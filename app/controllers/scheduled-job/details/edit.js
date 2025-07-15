import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isValidCron } from 'cron-validator';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import cronstrue from 'cronstrue';

export default class ScheduledJobDetailsEditController extends Controller {
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

  @action
  cancelEditScheduledJob() {
    this.router.transitionTo('scheduled-job.details');
  }

  get updatedTitle() {
    return this.job.title !== this.newTitle;
  }

  @action
  setTitle(event) {
    this.newTitleValid = event.target.value;
  }

  @action
  setCron(event) {
    this.newCronPattern = event.target.value;
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

  update = task(async () => {
    if (!this.validateForm()) return;
    try {
      const schedule = await this.job.schedule;
      await this.job.set('modified', new Date());
      if (this.updatedTitle) await this.job.set('title', this.newTitle);
      await this.job.save();

      if (this.updatedFrequency) {
        await schedule.set('repeatFrequency', this.newCronPattern);
        await schedule.save();
      }

      this.toaster.success('Changes to scheduled job saved', 'Save success', {
        icon: 'check',
        timeOut: 10000,
        closable: true,
      });
      this.router.transitionTo('scheduled-job.details');
    } catch (err) {
      this.job.rollbackAttributes();
      const schedule = await this.job.schedule;
      schedule.rollbackAttributes();

      this.toaster.error(
        `Error while saving changes to the scheduled job: (${err})`,
        'Saving failed',
        { icon: 'cross', timeOut: 10000, closable: true }
      );
    }
  });
}
