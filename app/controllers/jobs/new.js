import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {
  JOB_OP_TYPE_CREATE,
  JOB_OP_TYPE_HARVEST,
  JOB_OP_TYPE_HARVEST_AND_IMPORT,
  JOB_OP_TYPE_IMPORT,
  JOB_CREATOR_SELF_SERVICE,
  JOB_OP_TYPE_HARVEST_WORSHIP,
  JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT,
  BASIC_AUTH,
  OAUTH2,
} from '../../utils/constants';
import createAuthenticationConfiguration from '../../utils/create-authentication-configuration';
import config from 'frontend-harvesting-self-service/config/environment';
import { inject as service } from '@ember/service';

export default class JobsNewController extends Controller {
  jobHarvest = JOB_OP_TYPE_HARVEST;
  jobImport = JOB_OP_TYPE_IMPORT;
  jobHarvestAndImport = JOB_OP_TYPE_HARVEST_AND_IMPORT;
  jobHarvestWorship = JOB_OP_TYPE_HARVEST_WORSHIP;
  jobHarvestWorshipAndImport = JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT;

  jobOperations = Array.from(JOB_OP_TYPE_CREATE).map(([key, value]) => {
    return { label: value, uri: key };
  });

  creator = JOB_CREATOR_SELF_SERVICE;

  harvestTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/collecting';
  importTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/publishHarvestedTriples';

  securitySchemesOptions = [BASIC_AUTH, OAUTH2];

  authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
    config.harvester.authEnabled
  );

  @tracked url;
  @tracked graphName;
  @tracked comment;
  @tracked selectedJobOperation;
  @tracked selectedSecurityScheme;
  @tracked securityScheme = {};
  @tracked credentials = {};
  @tracked scheduling = false;

  @service toaster;
  @service router;

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
  async scheduleHarvestJob() {
    this.scheduling = true;

    const scheduledJob = this.store.createRecord('job', {
      status: 'http://redpencil.data.gift/id/concept/JobStatus/busy',
      created: this.currentTime,
      modified: this.currentTime,
      creator: this.creator,
      comment: this.comment,
      operation: this.selectedJobOperation.uri,
    });

    const remoteDataObject = this.store.createRecord('remote-data-object', {
      source: this.url,
      status: null, // this is deliberate, cf. infra when saving everything
      requestHeader: 'http://data.lblod.info/request-headers/accept/text/html',
      created: this.currentTime,
      modified: this.currentTime,
      creator: this.creator,
    });

    const collection = this.store.createRecord('harvesting-collection', {
      creator: this.creator,
      authenticationConfiguration: this.selectedSecurityScheme
        ? await createAuthenticationConfiguration(
            this.selectedSecurityScheme,
            this.securityScheme,
            this.credentials,
            this.store
          )
        : null, // authenticationConfiguration is optional
      remoteDataObjects: [remoteDataObject],
    });

    const dataContainer = this.store.createRecord('data-container', {
      harvestingCollections: [collection],
    });

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
    try {
      await scheduledJob.save();
      await remoteDataObject.save();
      await collection.save();
      await dataContainer.save();
      await task.save();
      // This a huge abstraction leak we need to tackle one day
      // Basically we are coordinating deltas when the download should start, after all the rest of the data
      // is created. Else we have a timing issue, i.e. the downlad ready, before all other meta-data was created.
      remoteDataObject.status =
        'http://lblod.data.gift/file-download-statuses/ready-to-be-cached';
      await remoteDataObject.save();

      this.toaster.success(
        'New job succesfully scheduled.',
        'Scheduling success',
        { icon: 'check', timeOut: 10000, closable: true }
      );
      this.router.transitionTo('jobs');
      //Don't do this, because the button will become active again before the route has finished loading.
      //this.scheduling = false;
    } catch (err) {
      this.toaster.error(
        `Error while scheduling new job: (${err})`,
        'Scheduling failed',
        { icon: 'cross', timeOut: 10000, closable: true }
      );
      this.scheduling = false;
    }
  }

  @action
  async scheduleImportJob() {
    this.scheduling = true;

    const scheduledJob = this.store.createRecord('job', {
      status: 'http://redpencil.data.gift/id/concept/JobStatus/busy',
      created: this.currentTime,
      modified: this.currentTime,
      creator: this.creator,
      comment: this.comment,
      operation: this.selectedJobOperation.uri,
    });

    const dataContainer = this.store.createRecord('data-container', {
      hasGraph: this.graphName,
    });

    const task = this.store.createRecord('task', {
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
      created: this.currentTime,
      modified: this.currentTime,
      operation: this.importTaskOperation,
      comment: this.comment,
      index: '0',
      inputContainers: [dataContainer],
      job: scheduledJob,
    });

    try {
      await scheduledJob.save();
      await dataContainer.save();
      await task.save();
      this.toaster.success(
        'New job succesfully scheduled.',
        'Scheduling success',
        { icon: 'check', timeOut: 10000, closable: true }
      );
      this.router.transitionTo('jobs');
      //Don't do this, because the button will become active again before the route has finished loading.
      //this.scheduling = false;
    } catch (err) {
      this.toaster.error(
        `Error while scheduling new job: (${err})`,
        'Scheduling failed',
        { icon: 'cross', timeOut: 10000, closable: true }
      );
      this.scheduling = false;
    }
  }
}
