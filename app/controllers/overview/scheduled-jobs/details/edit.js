import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isValidCron } from 'cron-validator';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import cronstrue from 'cronstrue';

export default class OverviewScheduledJobsDetailsEditController extends Controller {
  // Edit Popup fields
  @tracked newTitle;
  @tracked newTitleValid;
  @tracked newCronPattern;
  @tracked newCronPatternValid;
  @tracked newEndpoint;
  @tracked newEndpointValid;
  @tracked originalEndpoint;
  @tracked hasEndpoint = false;
  @tracked isLoadingEndpoint = false;

  @service toaster;
  @service router;

  get job() {
    return this.model;
  }

  get newCronDescription() {
    if (!this.newCronPattern) {
      return 'Please enter a cron pattern';
    }

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
    this.router.transitionTo('overview.scheduled-jobs.details');
  }

  findEndpointSource = task(async () => {
    const scheduledTasks = await this.job.scheduledTasks;
    if (!scheduledTasks.length) return null;

    const firstTask = scheduledTasks[0];
    const inputContainers = await firstTask.inputContainers;
    if (!inputContainers.length) return null;

    const firstContainer = inputContainers[0];
    const harvestingCollections = await firstContainer.harvestingCollections;
    if (!harvestingCollections.length) return null;

    const firstCollection = harvestingCollections[0];
    const remoteDataObjects = await firstCollection.remoteDataObjects;
    if (!remoteDataObjects.length) return null;

    return remoteDataObjects[0].source;
  });

  loadCurrentEndpoint = task(async () => {
    try {
      const endpointSource = await this.findEndpointSource.perform();

      if (endpointSource) {
        // Job has an endpoint - load it for editing
        this.originalEndpoint = endpointSource;
        this.newEndpoint = endpointSource;
        this.hasEndpoint = true;
      } else {
        // Job has no endpoint - this is valid for some job types
        this.originalEndpoint = null;
        this.newEndpoint = null;
        this.hasEndpoint = false;
      }
    } catch (error) {
      console.error('Failed to load current endpoint:', error);
      this.hasEndpoint = false;
      this.toaster.error(
        'Failed to load endpoint information',
        'Loading Error',
        { icon: 'cross', timeOut: 5000, closable: true }
      );
    }
  });

  get updatedTitle() {
    return this.job.title !== this.newTitle;
  }

  @action
  setTitle(event) {
    this.newTitle = event.target.value;
  }

  @action
  setCron(event) {
    this.newCronPattern = event.target.value;
  }

  @action
  setEndpoint(event) {
    this.newEndpoint = event.target.value;
  }

  get updatedFrequency() {
    return this.job.get('schedule.frequency') !== this.newCronPattern;
  }

  get updatedEndpoint() {
    return this.hasEndpoint && this.originalEndpoint !== this.newEndpoint;
  }

  @action
  validateForm() {
    this.newTitleValid = !!this.newTitle;
    this.newCronPatternValid =
      !!this.newCronPattern && isValidCron(this.newCronPattern);

    // Only validate endpoint if this job type has one
    this.newEndpointValid = this.hasEndpoint ? !!this.newEndpoint : true;

    return (
      this.newTitleValid && this.newCronPatternValid && this.newEndpointValid
    );
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

      if (this.updatedEndpoint) {
        await this.updateEndpoint.perform();
      }

      this.toaster.success('Changes to scheduled job saved', 'Save success', {
        icon: 'check',
        timeOut: 10000,
        closable: true,
      });
      this.router.transitionTo('overview.scheduled-jobs.details');
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

  updateEndpoint = task(async () => {
    if (!this.hasEndpoint) {
      throw new Error(
        'Cannot update endpoint for job type that does not have one'
      );
    }

    const scheduledTasks = await this.job.scheduledTasks;

    if (scheduledTasks.length > 0) {
      const firstTask = scheduledTasks[0];
      const inputContainers = await firstTask.inputContainers;

      if (inputContainers.length > 0) {
        const firstContainer = inputContainers[0];
        const harvestingCollections =
          await firstContainer.harvestingCollections;

        if (harvestingCollections.length > 0) {
          const firstCollection = harvestingCollections[0];
          const remoteDataObjects = await firstCollection.remoteDataObjects;

          if (remoteDataObjects.length > 0) {
            const firstRemoteDataObject = remoteDataObjects[0];
            await firstRemoteDataObject.set('source', this.newEndpoint);
            await firstRemoteDataObject.save();
          } else {
            throw new Error('No remote data object found to update endpoint');
          }
        } else {
          throw new Error('No harvesting collection found to update endpoint');
        }
      } else {
        throw new Error('No input container found to update endpoint');
      }
    } else {
      throw new Error('No scheduled task found to update endpoint');
    }
  });
}
