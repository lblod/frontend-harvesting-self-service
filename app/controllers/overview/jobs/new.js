import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import createAuthenticationConfiguration from '../../../utils/create-authentication-configuration';
import config from 'frontend-harvesting-self-service/config/environment';
import * as cts from '../../../utils/constants';
import { isValidUrl } from '../../../utils/string-validation';

export default class OverviewJobsNewController extends Controller {
  jobHarvest = cts.JOB_OP_TYPE_HARVEST;
  jobImport = cts.JOB_OP_TYPE_IMPORT;
  jobHarvestAndImport = cts.JOB_OP_TYPE_HARVEST_AND_IMPORT;
  jobHarvestWorship = cts.JOB_OP_TYPE_HARVEST_WORSHIP;
  jobHarvestWorshipAndImport = cts.JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT;
  jobCodelistMapping = cts.JOB_OP_TYPE_CODELIST_MAPPING;
  jobHarvestOsloEli = cts.JOB_OP_TYPE_HARVESTING_OSLO_TO_ELI;
  jobHarvestPdfToELI = cts.JOB_OP_TYPE_HARVESTING_PDF_TO_ELI;
  jobPdfScraping = cts.JOB_OP_TYPE_PDF_SCRAPING;

  @tracked jobOperations = Array.from(cts.JOB_OP_TYPE_CREATE).map(
    ([key, value]) => {
      return { label: value, uri: key };
    },
  );

  creator = cts.JOB_CREATOR_SELF_SERVICE;

  harvestTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/singleton-job';
  importTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/publishHarvestedTriples';

  intialConsumerSyncModeUri = cts.CONSUMER_SYNC_MODES.initial;
  deltaConsumerSyncModeUri = cts.CONSUMER_SYNC_MODES.delta;

  securitySchemesOptions = [cts.BASIC_AUTH, cts.OAUTH2];

  authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
    config.harvester.authEnabled,
  );

  @tracked url;
  @tracked urlValid;
  @tracked graphName;
  @tracked graphNameValid;
  @tracked vendor;
  @tracked vendorValid;
  @tracked comment;
  @tracked selectedJobOperation;
  @tracked selectedJobOperationValid;
  @tracked selectedSecurityScheme;
  @tracked securityScheme = {};
  @tracked credentials = {};
  @tracked decisionUri;
  @tracked decisionUriValid;
  @tracked codelistUri;
  @tracked codelistUriValid = true;
  @tracked graphForTargetsUri;
  @tracked graphForTargetsUriValid;
  @tracked propertyPathForTextUri = 'https://data.europarl.europa.eu/def/epvoc#expressionContent';
  @tracked propertyPathForTextUriValid;
  @tracked confidenceTreshold = 0;
  @tracked confidenceTresholdValid;

  @tracked loadingMunicipalities = false;
  @tracked municipalities = [];
  @tracked selectedMunicipality;

  consumeLokaalBeslistPublishedByOptions = [{ label: 'Ghent' }];
  consumeLokaalBeslistPublishedBy =
    this.consumeLokaalBeslistPublishedByOptions[0];

  @service toaster;
  @service router;
  @service store;

  get currentTime() {
    return new Date();
  }

  get isJobWithMultipleEndpoints() {
    return this.selectedJobOperation?.uri === this.jobPdfScraping;
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
    this.url = undefined;

    if (selected?.uri === cts.JOB_OP_TYPE_HARVESTING_PDF_TO_ELI) {
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
    } else {
      this.municipalities = [];
      this.selectedMunicipality = null;
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
    //TODO use proper validation library
    if (this.selectedJobOperation) this.selectedJobOperationValid = true;
    else this.selectedJobOperationValid = false;
    if (this.url) this.urlValid = true;
    else this.urlValid = false;
    if (this.graphName) this.graphNameValid = true;
    else this.graphNameValid = false;
    if (this.vendor) this.vendorValid = true;
    else this.vendorValid = false;
    this.decisionUriValid = true;
    this.codelistUriValid = !!this.codelistUri;
    this.graphForTargetsUriValid = true;
    this.propertyPathForTextUriValid = !!this.propertyPathForTextUri;
    this.confidenceTresholdValid = !isNaN(parseFloat(this.confidenceTreshold));

    if (!this.selectedJobOperation) return false;
    if (this.selectedJobOperation.uri === this.jobImport)
      return this.selectedJobOperationValid && this.graphNameValid;
    else if (this.selectedJobOperation.uri === this.jobCodelistMapping)
      return (
        this.selectedJobOperationValid &&
        this.decisionUriValid &&
        this.codelistUriValid &&
        this.graphForTargetsUriValid &&
        this.propertyPathForTextUriValid &&
        this.confidenceTresholdValid
      );
    else return this.selectedJobOperationValid && this.urlValid;
  }

  @action
  async cancelCreateAndStartJob() {
    this.router.transitionTo('overview.jobs');
  }

  createAndStartJob = task(async () => {
    let scheduledJob;
    try {
      if (!this.validateForm()) return;

      let jobAttributes = {
        status: 'http://redpencil.data.gift/id/concept/JobStatus/busy',
        created: this.currentTime,
        modified: this.currentTime,
        creator: this.creator,
        comment: this.comment,
        operation: this.selectedJobOperation.uri,
        vendor: this.vendor,
      };

      let shapeForTargets;
      if (this.selectedJobOperation.uri === this.jobCodelistMapping) {
        if (this.decisionUri) {
          shapeForTargets = this.store.createRecord('node-shape', {
            targetNode: [this.decisionUri],
          });
        } else {
          shapeForTargets = this.store.createRecord('node-shape', {
            targetClass: [
              'http://data.europa.eu/eli/ontology#Expression',
            ],
          });
        }
        await shapeForTargets.save();
        jobAttributes = Object.assign(jobAttributes, {
          codelist: this.codelistUri,
          shapeForTargets: [shapeForTargets],
          graphForTargets: this.graphForTargetsUri || undefined,
          propertyPathForText: this.propertyPathForTextUri || 'https://data.europarl.europa.eu/def/epvoc#expressionContent',
          confidenceTreshold: this.confidenceTreshold || '0',
        });
        scheduledJob = this.store.createRecord('annotation-job', jobAttributes);
      } else {
        scheduledJob = this.store.createRecord('job', jobAttributes);
      }
      await scheduledJob.save();

      const inputContainers = [];
      let dataContainer, dataContainerWithMunicipality;
      if (this.selectedJobOperation.uri === this.jobImport) {
        dataContainer = this.store.createRecord('data-container', {
          hasGraph: this.graphName,
        });
        await dataContainer.save();
      } else {
        let sources = [this.url.trim()];
        if (this.selectedJobOperation.uri === this.jobCodelistMapping) {
          sources = [shapeForTargets.uri];
        }
        if (this.selectedJobOperation.uri === this.jobPdfScraping) {
          const newLinePattern = /\r?\n/;
          sources = this.url.split(newLinePattern).map((source) => {
            if (!isValidUrl(source)) {
              throw new Error(`"${source}" is not a valid url.`);
            }
          });
        }

        const remoteDataObjects = sources.map((source) => {
          return this.store.createRecord('remote-data-object', {
            source,
            // This is deliberate, the collector service will set the status and
            // therefore start the job later:
            status: undefined,
            requestHeader:
              'http://data.lblod.info/request-headers/accept/text/html',
            created: this.currentTime,
            modified: this.currentTime,
            creator: this.creator,
          });
        });
        await Promise.all(
          remoteDataObjects.map(async (rdo) => await rdo.save()),
        );
        const collection = this.store.createRecord('harvesting-collection', {
          creator: this.creator,
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

        dataContainer = this.store.createRecord('data-container', {
          harvestingCollections: [collection],
        });
        await dataContainer.save();
        inputContainers.push(dataContainer);

        if (this.selectedJobOperation.uri === this.jobHarvestPdfToELI) {
          dataContainerWithMunicipality = this.store.createRecord(
            'data-container',
            {
              hasResource: [this.selectedMunicipality.uri],
            },
          );

          await dataContainerWithMunicipality.save();
          inputContainers.push(dataContainerWithMunicipality);
        }
      }

      const task = this.store.createRecord('task', {
        status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
        created: this.currentTime,
        modified: this.currentTime,
        operation: this.harvestTaskOperation,
        comment: this.comment,
        index: '0',
        inputContainers: inputContainers,
        job: scheduledJob,
      });
      await task.save();

      this.toaster.success(
        'New job succesfully scheduled.',
        'Scheduling success',
        { icon: 'check', timeOut: 10000, closable: true },
      );
      this.router.transitionTo('overview.jobs');
    } catch (err) {
      this.toaster.error(
        `Error while scheduling new job: (${err})`,
        'Scheduling failed',
        { icon: 'cross', timeOut: 10000, closable: true },
      );
      await scheduledJob.destroyRecord();
    }
  });
}
