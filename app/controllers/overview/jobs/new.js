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
  jobCodelistMappingTraining = cts.JOB_OP_TYPE_CODELIST_MAPPING_TRAINING;
  jobCodelistMappingEvaluation = cts.JOB_OP_TYPE_CODELIST_MAPPING_EVALUATION;
  jobHarvestOsloEli = cts.JOB_OP_TYPE_HARVESTING_OSLO_TO_ELI;
  jobEliToNERAndNEL = cts.JOB_OP_TYPE_NER_AND_NEL_ANNOTATIONS;
  jobOparlToELI = cts.JOB_OP_TYPE_HARVESTING_OPARL;
  jobHarvestPdfToEli = cts.JOB_OP_TYPE_HARVESTING_PDF_TO_ELI;
  jobHarvestJsonToEli = cts.JOB_OP_TYPE_HARVESTING_JSON_TO_ELI;
  jobHarvestPdfToEnriched = cts.JOB_OP_TYPE_HARVESTING_PDF_TO_ENRICHED;
  jobHarvestJsonToEnriched = cts.JOB_OP_TYPE_HARVESTING_JSON_TO_ENRICHED;

  @tracked jobOperations = Array.from(cts.JOB_OP_TYPE_CREATE).map(
    ([key, value]) => {
      return { label: value, uri: key };
    },
  );

  creator = cts.JOB_CREATOR_SELF_SERVICE;

  request_headers = cts.REQUEST_HEADERS;

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
  @tracked decisionUris;
  @tracked decisionUrisValid = true;
  @tracked codelist;
  @tracked codelistValid = true;
  @tracked propertyPathForTextUri =
    '<https://data.europarl.europa.eu/def/epvoc#expressionContent>';
  @tracked propertyPathForTextUriValid;
  @tracked targetClassUri = 'http://data.europa.eu/eli/ontology#Expression';
  @tracked targetClassUriValid;
  @tracked confidenceThreshold = 0;
  @tracked confidenceThresholdValid;

  @tracked loadingMunicipalities = false;
  @tracked municipalities = [];
  @tracked selectedMunicipality;
  @tracked municipalityValid = true;

  @tracked splitPdf = true;

  consumeLokaalBeslistPublishedByOptions = [{ label: 'Ghent' }];
  consumeLokaalBeslistPublishedBy =
    this.consumeLokaalBeslistPublishedByOptions[0];

  @service toaster;
  @service router;
  @service store;

  get currentTime() {
    return new Date();
  }

  get isJobWithGraphName() {
    return cts.isJobWithGraphName(this.selectedJobOperation?.uri);
  }
  get isJobWithSingleUrl() {
    return cts.isJobWithSingleUrl(this.selectedJobOperation?.uri);
  }
  get isJobWithMultipleEndpoints() {
    return cts.isJobWithMultipleEndpoints(this.selectedJobOperation?.uri);
  }
  get isJobWithDecisionUris() {
    return cts.isJobWithDecisionUris(this.selectedJobOperation?.uri);
  }
  get isJobWithDecisionSelector() {
    return cts.isJobWithDecisionSelector(this.selectedJobOperation?.uri);
  }
  get isJobWithCodelist() {
    return cts.isJobWithCodelist(this.selectedJobOperation?.uri);
  }
  get isJobWithMunicipality() {
    return (
      cts.isJobWithMunicipality(this.selectedJobOperation?.uri) ||
      cts.isJobWithDecisionSelector(this.selectedJobOperation?.uri)
    );
  }
  get isJobWithAuthentication() {
    return cts.isJobWithAuthentication(this.selectedJobOperation?.uri);
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

    if (this.isJobWithMunicipality) {
      await this.loadMunicipalities();
    }
  }

  @action
  setProperty(property, event) {
    this[property] = event?.target ? event.target.value : event;
    this[`${property}Valid`] = !!this[property];
  }

  @action
  noop() {}

  @action
  changeSelectedMunicipality(org) {
    this.selectedMunicipality = org;
  }

  @action
  toggleSplitPdf() {
    this.splitPdf = !this.splitPdf;
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
    this.codelistValid = !!this.codelist;
    this.municipalityValid = !!this.selectedMunicipality;
    this.targetClassUriValid = !!this.targetClassUri;
    this.propertyPathForTextUriValid = !!this.propertyPathForTextUri;
    this.confidenceThresholdValid = !isNaN(
      parseFloat(this.confidenceThreshold),
    );

    let isValid = this.selectedJobOperationValid;
    // Once isValid is false, it stays false until the end
    if (this.selectedJobOperation.uri === this.jobImport && isValid)
      isValid = this.graphNameValid;
    if (this.isJobWithCodelist && isValid) {
      isValid = this.codelistValid;
    }
    if (this.isJobWithMunicipality && isValid) {
      isValid = this.municipalityValid;
    }
    if (this.isJobWithDecisionSelector && isValid) {
      isValid = this.propertyPathForTextUriValid && this.targetClassUriValid;
    }
    if (this.isJobWithSingleUrl && isValid) {
      isValid = this.urlValid;
    }
    return isValid;
  }

  @action
  async cancelCreateAndStartJob() {
    this.router.transitionTo('overview.jobs');
  }

  createAndStartJob = task(async () => {
    let scheduledJob;
    try {
      if (!this.validateForm()) return;

      let jobName = 'job';
      if (this.isJobWithDecisionSelector) {
        jobName = 'annotation-job';
      }

      let jobAttributes = {
        status: 'http://redpencil.data.gift/id/concept/JobStatus/busy',
        created: this.currentTime,
        modified: this.currentTime,
        creator: this.creator,
        comment: this.comment,
        operation: this.selectedJobOperation.uri,
        vendor: this.vendor,
      };

      if (this.isJobWithCodelist) {
        jobAttributes.codelist = this.codelist?.uri;
      }

      if (this.isJobWithMultipleEndpoints && this.splitPdf) {
        jobAttributes.splitDecisions = this.splitPdf;
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
        await shapeForTargets.save();
        jobAttributes = Object.assign(jobAttributes, {
          shapeForTargets: [shapeForTargets],
          graphForTargets: this.selectedMunicipality?.targetGraph || undefined,
          propertyPathForText: this.propertyPathForTextUri,
          confidenceThreshold: this.confidenceThreshold || '0',
        });
      }

      scheduledJob = this.store.createRecord(jobName, jobAttributes);
      await scheduledJob.save();

      const inputContainers = [];
      const sources = [];
      let dataContainer, dataContainerWithMunicipality;
      if (this.selectedJobOperation.uri === this.jobImport) {
        dataContainer = this.store.createRecord('data-container', {
          hasGraph: this.graphName,
        });
        await dataContainer.save();
      } else if (this.isJobWithSingleUrl) {
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
      if (sources.length > 0) {
        const remoteDataObjects = sources.map((source) => {
          return this.store.createRecord('remote-data-object', {
            source,
            // This is deliberate, the collector service will set the status and
            // therefore start the job later:
            status: undefined,
            requestHeader: this.request_headers.has(
              this.selectedJobOperation.uri,
            )
              ? this.request_headers.get(this.selectedJobOperation.uri)
              : undefined,
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
      } else {
        dataContainer = this.store.createRecord('data-container', {});
        await dataContainer.save();
      }
      inputContainers.push(dataContainer);

      if (this.isJobWithMunicipality && this.selectedMunicipality?.uri) {
        dataContainerWithMunicipality = this.store.createRecord(
          'data-container',
          {
            hasResource: [this.selectedMunicipality.uri],
          },
        );

        await dataContainerWithMunicipality.save();
        inputContainers.push(dataContainerWithMunicipality);
      }

      if (this.selectedJobOperation.uri === this.jobHarvestOsloEli) {
        for (const uri of cts.LOKAAL_BESLIST_HARDCODED_BESTUURSEENHEDEN_URIS) {
          const dataContainerWithBestuurseenheid = this.store.createRecord(
            'data-container',
            {
              hasResource: [uri],
            },
          );

          await dataContainerWithBestuurseenheid.save();
          inputContainers.push(dataContainerWithBestuurseenheid);
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

  async loadMunicipalities() {
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
