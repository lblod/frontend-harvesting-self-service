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
import { isValidUrl } from '../../../utils/string-validation';

export default class OverviewScheduledJobsNewController extends Controller {
  jobHarvest = cts.JOB_OP_TYPE_HARVEST;
  jobHarvestAndImport = cts.JOB_OP_TYPE_HARVEST_AND_IMPORT;
  jobHarvestWorship = cts.JOB_OP_TYPE_HARVEST_WORSHIP;
  jobHarvestWorshipAndImport = cts.JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT;
  jobCodelistMappingTraining = cts.JOB_OP_TYPE_CODELIST_MAPPING_TRAINING;
  jobCodelistMappingAnnotating = cts.JOB_OP_TYPE_CODELIST_MAPPING_ANNOTATING;
  jobHarvestOsloEli = cts.JOB_OP_TYPE_HARVESTING_OSLO_TO_ELI;
  jobPdfScraping = cts.JOB_OP_TYPE_PDF_SCRAPING;

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
  @tracked decisionUris;
  @tracked decisionUrisValid;
  @tracked codelistUri;
  @tracked codelistUriValid = true;
  @tracked graphForTargetsUri;
  @tracked graphForTargetsUriValid;
  @tracked propertyPathForTextUri =
    'https://data.europarl.europa.eu/def/epvoc#expressionContent';
  @tracked propertyPathForTextUriValid;
  @tracked confidenceTreshold = 0;
  @tracked confidenceTresholdValid;

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

<<<<<<< HEAD
  get isJobWithMultipleEndpoints() {
    return this.selectedJobOperation?.uri === this.jobPdfScraping;
=======
  get isCodelistMappingJob() {
    return (
      this.selectedJobOperation.uri === this.jobCodelistMappingTraining ||
      this.selectedJobOperation.uri === this.jobCodelistMappingAnnotating
    );
>>>>>>> 36e2433 (Split codelist mapping into two jobs.)
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
  async setJobOperation(selected) {
    this.selectedJobOperation = selected;
    this.url =
      selected?.uri === this.jobHarvestOsloEli
        ? this.deltaConsumerSyncModeUri
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
    this.selectedJobOperationValid = !!this.selectedJobOperation;
    this.urlValid = !!this.url;
    this.titleValid = !!this.title;
    this.cronPatternValid = this.isValidCronPattern;
    this.vendorValid = !!this.vendor;
    this.decisionUrisValid = true;
    this.codelistUriValid = !!this.codelistUri;
    this.graphForTargetsUriValid = true;
    this.propertyPathForTextUriValid = true;
    this.confidenceTresholdValid = !isNaN(parseFloat(this.confidenceTreshold));

    const baseValid =
      this.selectedJobOperationValid &&
      this.titleValid &&
      this.cronPatternValid;

    if (this.isCodelistMappingJob)
      return (
        baseValid &&
        this.decisionUrisValid &&
        this.codelistUriValid &&
        this.graphForTargetsUriValid &&
        this.propertyPathForTextUriValid &&
        this.confidenceTresholdValid
      );
    else return baseValid && this.urlValid;
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

      let jobName = 'scheduled-job';
      const jobAttributes = {
        creator: this.creator,
        created: this.currentTime,
        modified: this.currentTime,
        operation: this.selectedJobOperation.uri,
        title: this.title,
        schedule: cronSchedule,
        vendor: this.vendor,
      };

      let sources = [this.url.trim()];
      if (this.selectedJobOperation.uri === this.jobPdfScraping) {
        const newLinePattern = /\r?\n/;
        sources = this.url.split(newLinePattern).map((source) => {
          if (!isValidUrl(source)) {
            throw new Error(`Value: "${source}" is not a valid url.`);
          }
        });
      }
      const remoteDataObjects = sources.map((source) => {
        return this.store.createRecord('remote-data-object', {
          source: source,
          status: undefined,
          requestHeader:
            'http://data.lblod.info/request-headers/accept/text/html',
          created: this.currentTime,
          modified: this.currentTime,
          creator: this.creator,
        });
      });

      if (this.isCodelistMappingJob) {
        let shapeForTargets;
        if (this.decisionUris) {
          shapeForTargets = this.store.createRecord('node-shape', {
            targetNode: this.decisionUris.split(/\n/).filter((x) => x),
          });
        } else {
          shapeForTargets = this.store.createRecord('node-shape', {
            targetClass: ['http://data.europa.eu/eli/ontology#Expression'],
          });
        }
        await shapeForTargets.save();
        jobAttributes.shapeForTargets = [shapeForTargets];
        jobAttributes.codelist = this.codelistUri;
        jobAttributes.graphForTargets = this.graphForTargetsUri || undefined;
        jobAttributes.propertyPathForText =
          this.propertyPathForTextUri ||
          'https://data.europarl.europa.eu/def/epvoc#expressionContent';
        jobAttributes.confidenceTreshold = this.confidenceTreshold || '0';
        jobName = 'scheduled-annotation-job';
      }

      const scheduledJob = this.store.createRecord(jobName, jobAttributes);

      await Promise.all(remoteDataObjects.map(async (rdo) => await rdo.save()));
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
        remoteDataObjects: remoteDataObjects,
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
      await collection.save();
      await dataContainer.save();
      await scheduledJob.save();
      await scheduledTask.save();

      this.toaster.success(
        'New job successfully scheduled.',
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
