import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import { isValidCron } from 'cron-validator';
import cronstrue from 'cronstrue';
import createAuthenticationConfiguration from '../../../utils/create-authentication-configuration';
import config from 'frontend-harvesting-self-service/config/environment';
import * as cts from '../../../utils/constants';

export default class OverviewScheduledJobsNewController extends Controller {
  jobHarvest = cts.JOB_OP_TYPE_HARVEST;
  jobHarvestAndImport = cts.JOB_OP_TYPE_HARVEST_AND_IMPORT;
  jobHarvestWorship = cts.JOB_OP_TYPE_HARVEST_WORSHIP;
  jobHarvestWorshipAndImport = cts.JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT;

  jobOperations = Array.from(cts.JOB_OP_TYPE_CREATE).map(([key, value]) => {
    return { label: value, uri: key };
  });

  creator = cts.JOB_CREATOR_SELF_SERVICE;

  harvestTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/singleton-job';
  importTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/publishHarvestedTriples';

  securitySchemesOptions = [cts.BASIC_AUTH, cts.OAUTH2];

  authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
    config.harvester.authEnabled,
  );

  @tracked title;
  @tracked titleValid;
  @tracked url;
  @tracked urlValid;
  @tracked selectedJobOperation;
  @tracked selectedJobOperationValid;
  @tracked cronPattern;
  @tracked cronPatternValid;
  @tracked vendor;
  @tracked vendorValid;
  @tracked selectedSecurityScheme;
  @tracked securityScheme;
  @tracked credentials;

  @service toaster;
  @service router;
  @service store;

  get cronDescription() {
    const isValidCronExpression = this.isValidCronPattern;

    if (isValidCronExpression) {
      return cronstrue.toString(this.cronPattern, {
        use24HourTimeFormat: true,
      });
    } else {
      return 'This is not a valid cron pattern';
    }
  }

  get isValidCronPattern() {
    return isValidCron(this.cronPattern);
  }

  get currentTime() {
    const timestamp = new Date();
    return timestamp;
  }

  @action
  updateCredentials(attributeName, credentials) {
    this.credentials[attributeName] = credentials;
  }
  @action
  updateSecurityScheme(attributeName, securityScheme) {
    this.securityScheme[attributeName] = securityScheme;
  }

  @action
  setSecurityScheme(selected) {
    this.selectedSecurityScheme = selected;
  }

  @action
  setJobOperation(selected) {
    this.selectedJobOperation = selected;
  }

  @action
  setProperty(property, event) {
    this[property] = event.target.value;
    this[`${property}Valid`] = !!this[property];
  }

  @action
  validateForm() {
    this.selectedJobOperationValid = !!this.selectedJobOperation;
    this.urlValid = !!this.url;
    this.titleValid = !!this.title;
    this.cronPatternValid = this.isValidCronPattern;
    this.vendorValid = !!this.vendor;
    return (
      this.selectedJobOperationValid &&
      this.urlValid &&
      this.titleValid &&
      this.cronPatternValid
    );
  }

  @action
  async cancelCreateScheduledJob() {
    this.router.transitionTo('overview.scheduled-jobs');
  }

  createScheduledJob = task(async () => {
    try {
      if (!this.validateForm()) return;

      const cronSchedule = this.store.createRecord('cron-schedule', {
        repeatFrequency: this.cronPattern,
      });

      const scheduledJob = this.store.createRecord('scheduled-job', {
        creator: this.creator,
        created: this.currentTime,
        modified: this.currentTime,
        operation: this.selectedJobOperation.uri,
        title: this.title,
        schedule: cronSchedule,
        vendor: this.vendor,
      });

      const remoteDataObject = this.store.createRecord('remote-data-object', {
        source: this.url,
        status: undefined,
        requestHeader:
          'http://data.lblod.info/request-headers/accept/text/html',
        created: this.currentTime,
        modified: this.currentTime,
        creator: this.creator,
      });

      const collection = this.store.createRecord('harvesting-collection', {
        creator: this.creator,
        //TODO: authentication configuration doesn't work currently for scheduled jobs. Because
        // - Shallow copy of authtentication configuration (see DL-4896)
        // - See timing issue comments, in controllers/jobs/new.js
        authenticationConfiguration: this.selectedSecurityScheme
          ? await createAuthenticationConfiguration(
              this.selectedSecurityScheme,
              this.securityScheme,
              this.credentials,
              this.store,
            )
          : null, // authenticationConfiguration is optional
        remoteDataObjects: [remoteDataObject],
      });

      const dataContainer = this.store.createRecord('data-container', {
        harvestingCollections: [collection],
      });

      const scheduledTask = this.store.createRecord('scheduled-task', {
        created: this.currentTime,
        modified: this.currentTime,
        operation: this.harvestTaskOperation,
        index: '0',
        inputContainers: [dataContainer],
        scheduledJob: scheduledJob,
      });

      await cronSchedule.save();
      await remoteDataObject.save();
      await collection.save();
      await dataContainer.save();
      await scheduledJob.save();
      await scheduledTask.save();

      this.toaster.success(
        'New job succesfully scheduled.',
        'Scheduling success',
        { icon: 'check', timeOut: 10000, closable: true },
      );
      this.router.transitionTo('overview.scheduled-jobs');
    } catch (err) {
      this.toaster.error(
        `Error while scheduling new job: (${err})`,
        'Scheduling failed',
        { icon: 'cross', timeOut: 10000, closable: true },
      );
    }
  });
}
