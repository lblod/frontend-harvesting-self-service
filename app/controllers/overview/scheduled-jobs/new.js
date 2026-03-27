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
  jobHarvestOsloEli = cts.JOB_OP_TYPE_HARVESTING_OSLO_TO_ELI;
  jobHarvestPdfEli = cts.JOB_OP_TYPE_HARVESTING_PDF_TO_ELI;

  jobOperations = Array.from(cts.JOB_OP_TYPE_CREATE).map(([key, value]) => {
    return { label: value, uri: key };
  });

  creator = cts.JOB_CREATOR_SELF_SERVICE;

  harvestTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/singleton-job';
  importTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/publishHarvestedTriples';

  deltaConsumerSyncModeUri = cts.CONSUMER_SYNC_MODES.delta;

  securitySchemesOptions = [cts.BASIC_AUTH, cts.OAUTH2];

  authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
    config.harvester.authEnabled,
  );

  @tracked title;
  @tracked titleValid;
  @tracked urls;
  @tracked urlsValid;
  @tracked selectedJobOperation;
  @tracked selectedJobOperationValid;
  @tracked cronPattern;
  @tracked cronPatternValid;
  @tracked vendor;
  @tracked vendorValid;
  @tracked selectedSecurityScheme;
  @tracked securityScheme;
  @tracked credentials;

  @tracked forceErrors;

  consumeLokaalBeslistPublishedByOptions = [{ label: 'Ghent' }];
  consumeLokaalBeslistPublishedBy =
    this.consumeLokaalBeslistPublishedByOptions[0];

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

  get isMultiUrlSupportedForJobOperation() {
    return this.selectedJobOperation.uri === this.jobHarvestPdfEli;
  }

  get url() {
    return this.urls?.[0];
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
    this.urls =
      selected?.uri === this.jobHarvestOsloEli
        ? [this.deltaConsumerSyncModeUri]
        : undefined;
  }

  @action
  setProperty(property, event) {
    this[property] = event.target.value;
    this[`${property}Valid`] = !!this[property];
  }

  @action
  noop() {}

  @action
  validateForm() {
    this.forceErrors = true;
    this.selectedJobOperationValid = !!this.selectedJobOperation;
    this.urlsValid = !!this.url;
    this.titleValid = !!this.title;
    this.cronPatternValid = this.isValidCronPattern;
    this.vendorValid = !!this.vendor;
    return (
      this.selectedJobOperationValid &&
      this.urlsValid &&
      this.titleValid &&
      this.cronPatternValid
    );
  }

  @action
  async cancelCreateScheduledJob() {
    this.forceErrors = false;
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
