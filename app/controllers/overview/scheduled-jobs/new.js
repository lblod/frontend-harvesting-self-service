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
  jobCodelistMappingEvaluation = cts.JOB_OP_TYPE_CODELIST_MAPPING_EVALUATION;
  jobHarvestOsloEli = cts.JOB_OP_TYPE_HARVESTING_OSLO_TO_ELI;
  jobHarvestPdfToELI = cts.JOB_OP_TYPE_HARVESTING_PDF_TO_ELI;
  jobPdfScraping = cts.JOB_OP_TYPE_PDF_SCRAPING;
  jobEliToNERAndNEL = cts.JOB_OP_TYPE_NER_AND_NEL_ANNOTATIONS;
  jobOparlToELI = cts.JOB_OP_TYPE_HARVESTING_OPARL;

  jobOperations = Array.from(cts.JOB_OP_TYPE_CREATE)
    .filter(([key]) => {
      return key !== this.jobHarvestPdfToELI; // Exclude the PDF to ELI job operation as this is supposed to be a one-time job
    })
    .map(([key, value]) => {
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
  @tracked decisionUrisValid = true;
  @tracked codelistUri;
  @tracked codelistUriValid = true;
  @tracked graphForTargetsUri;
  @tracked graphForTargetsUriValid;
  @tracked propertyPathForTextUri =
    '<http://data.europa.eu/eli/ontology#is_realized_by> / <https://data.europarl.europa.eu/def/epvoc#expressionContent>';
  @tracked propertyPathForTextUriValid;
  @tracked targetClassUri = 'http://data.europa.eu/eli/ontology#Work';
  @tracked targetClassUriValid;
  @tracked confidenceThreshold = 0;
  @tracked confidenceThresholdValid;

  @tracked loadingMunicipalities = false;
  @tracked municipalities = [];
  @tracked selectedMunicipality;

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

  get isJobWithSingleUrl() {
    return !this.isJobWithDecisionSelector && !this.isJobWithMultipleEndpoints;
  }

  get isJobWithMultipleEndpoints() {
    return this.selectedJobOperation?.uri === this.jobPdfScraping;
  }

  get isJobWithCodelist() {
    return (
      this.selectedJobOperation.uri === this.jobCodelistMappingTraining ||
      this.selectedJobOperation.uri === this.jobCodelistMappingEvaluation
    );
  }

  get isJobWithDecisionSelector() {
    return (
      this.selectedJobOperation?.uri === this.jobEliToNERAndNEL ||
      this.selectedJobOperation?.uri === this.jobCodelistMappingTraining ||
      this.selectedJobOperation?.uri === this.jobCodelistMappingEvaluation
    );
  }

  get isJobWithMunicipality() {
    return (
      this.selectedJobOperation?.uri === this.jobHarvestPdfToELI ||
      this.selectedJobOperation?.uri === this.jobPdfScraping
    );
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
    if (this.isJobWithMunicipality) {
      await this.loadMunicipalities();
    }
  }

  @action
  setProperty(property, event) {
    this[property] = event.target.value;
    this[`${property}Valid`] = !!this[property];
  }

  @action
  noop() {}

  @action
  changeSelectedMunicipality(org) {
    this.selectedMunicipality = org;
  }

  @action
  validateForm() {
    this.selectedJobOperationValid = !!this.selectedJobOperation;
    this.urlValid = !!this.url;
    this.titleValid = !!this.title;
    this.cronPatternValid = this.isValidCronPattern;
    this.vendorValid = !!this.vendor;
    this.codelistUriValid = !!this.codelistUri;
    this.graphForTargetsUriValid = true;
    this.propertyPathForTextUriValid = true;
    this.confidenceThresholdValid = !isNaN(
      parseFloat(this.confidenceThreshold),
    );

    // Once isValid is false, it stays false until the end
    let isValid =
      this.selectedJobOperationValid &&
      this.titleValid &&
      this.cronPatternValid;
    if (this.isJobWithCodelist && isValid) {
      isValid = this.codelistUriValid;
    }
    if (this.isJobWithDecisionSelector && isValid) {
      isValid =
        this.decisionUrisValid &&
        this.graphForTargetsUriValid &&
        this.propertyPathForTextUriValid &&
        this.targetClassUriValid;
    }
    if (this.isJobWithSingleUrl && isValid) {
      isValid = this.urlValid;
    }
    return isValid;
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
      await cronSchedule.save();

      let jobName = 'scheduled-job';
      if (this.isJobWithDecisionSelector) {
        jobName = 'scheduled-annotation-job';
      }

      let jobAttributes = {
        creator: this.creator,
        created: this.currentTime,
        modified: this.currentTime,
        operation: this.selectedJobOperation.uri,
        title: this.title,
        schedule: cronSchedule,
        vendor: this.vendor,
      };

      if (this.isJobWithCodelist) {
        jobAttributes.codelist = this.codelistUri;
      }
      if (this.isJobWithDecisionSelector) {
        let shapeForTargets;
        if (this.decisionUris) {
          shapeForTargets = this.store.createRecord('node-shape', {
            targetNode: this.decisionUris.split(/\n/).filter((x) => x),
          });
        } else {
          shapeForTargets = this.store.createRecord('node-shape', {
            targetClass: [this.targetClassUri.trim()],
          });
        }
        jobAttributes = Object.assign(jobAttributes, {
          shapeForTargets: [shapeForTargets],
          graphForTargets: this.graphForTargetsUri || undefined,
          propertyPathForText: this.propertyPathForTextUri,
          confidenceThreshold: this.confidenceThreshold || '0',
        });
      }

      const scheduledJob = this.store.createRecord(jobName, jobAttributes);
      await scheduledJob.save();

      const inputContainers = [];
      const sources = [];
      if (this.isJobWithSingleUrl) {
        sources.push(this.url.trim());
      } else if (this.isJobWithMultipleEndpoints) {
        const newLinePattern = /\r?\n/;
        this.url.split(newLinePattern).map((source) => {
          if (!isValidUrl(source)) {
            this.decisionUrisValid = false;
            throw new Error(`"${source}" is not a valid url.`);
          }
          sources.push(source.trim());
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
      await collection.save();

      const dataContainer = this.store.createRecord('data-container', {
        harvestingCollections: [collection],
      });
      await dataContainer.save();

      inputContainers.push(dataContainer);

      const scheduledTask = this.store.createRecord('scheduled-task', {
        created: this.currentTime,
        modified: this.currentTime,
        operation: this.harvestTaskOperation,
        index: '0',
        inputContainers: inputContainers,
        scheduledJob: scheduledJob,
      });
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

  async loadMunicipalities() {
    console.log('Loading municipalities...');
    this.loadingOrganizations = true;
    this.municipalities = await this.store.query('organization', {
      page: { size: 600 },
      filter: {
        classification:
          'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001',
      },
      sort: ':no-case:pref-label',
    });
    this.loadingOrganizations = false;
  }
}
