import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import createAuthenticationConfiguration from '../../../utils/create-authentication-configuration';
import config from 'frontend-harvesting-self-service/config/environment';
import * as cts from '../../../utils/constants';

export default class OverviewJobsNewController extends Controller {
  jobHarvest = cts.JOB_OP_TYPE_HARVEST;
  jobImport = cts.JOB_OP_TYPE_IMPORT;
  jobHarvestAndImport = cts.JOB_OP_TYPE_HARVEST_AND_IMPORT;
  jobHarvestWorship = cts.JOB_OP_TYPE_HARVEST_WORSHIP;
  jobHarvestWorshipAndImport = cts.JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT;
  jobCodelistMapping = cts.JOB_OP_TYPE_CODELIST_MAPPING;

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
  @tracked codelistUriValid;

  @service toaster;
  @service router;
  @service store;

  get currentTime() {
    return new Date();
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
    //TODO use proper validation library
    if (this.selectedJobOperation) this.selectedJobOperationValid = true;
    else this.selectedJobOperationValid = false;
    if (this.url) this.urlValid = true;
    else this.urlValid = false;
    if (this.graphName) this.graphNameValid = true;
    else this.graphNameValid = false;
    if (this.vendor) this.vendorValid = true;
    else this.vendorValid = false;
    this.decisionUriValid = !!this.decisionUri;
    this.codelistUriValid = !!this.codelistUri;

    if (this.selectedJobOperation.uri === this.jobImport)
      return this.selectedJobOperationValid && this.graphNameValid;
    else if (this.selectedJobOperation.uri === this.jobCodelistMapping)
      return (
        this.selectedJobOperationValid &&
        this.decisionUriValid &&
        this.codelistUriValid
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
        shapeForTargets = this.store.createRecord('node-shape', {
          targetNode: [this.decisionUri],
        });
        await shapeForTargets.save();
        jobAttributes = Object.assign(jobAttributes, {
          codelist: this.codelistUri,
          shapeForTargets: [shapeForTargets],
        });
        scheduledJob = this.store.createRecord('annotation-job', jobAttributes);
      } else {
        scheduledJob = this.store.createRecord('job', jobAttributes);
      }
      await scheduledJob.save();

      let dataContainer;
      if (this.selectedJobOperation.uri === this.jobImport) {
        dataContainer = this.store.createRecord('data-container', {
          hasGraph: this.graphName,
        });
        await dataContainer.save();
      } else {
        const source =
          this.selectedJobOperation.uri === this.jobCodelistMapping
            ? shapeForTargets.uri
            : this.url.trim();

        const remoteDataObject = this.store.createRecord('remote-data-object', {
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
        await remoteDataObject.save();

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
          remoteDataObjects: [remoteDataObject],
        });
        await collection.save();

        dataContainer = this.store.createRecord('data-container', {
          harvestingCollections: [collection],
        });
        await dataContainer.save();
      }

      const task = this.store.createRecord('task', {
        status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
        created: this.currentTime,
        modified: this.currentTime,
        operation: this.harvestTaskOperation,
        comment: this.comment,
        index: '0',
        inputContainers: [dataContainer],
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
