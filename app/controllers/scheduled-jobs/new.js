import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isValidCron } from 'cron-validator';
import cronstrue from 'cronstrue';
import {
  JOB_OP_TYPE_HARVEST,
  JOB_OP_TYPE_HARVEST_AND_IMPORT,
  JOB_CREATOR_SELF_SERVICE,
  JOB_OP_TYPE_HARVEST_WORSHIP,
  JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT,
  BASIC_AUTH,
  OAUTH2,
} from '../../utils/constants';
import createAuthenticationConfiguration from '../../utils/create-authentication-configuration';

export default class ScheduledJobsNewController extends Controller {
  jobHarvest = JOB_OP_TYPE_HARVEST;
  jobHarvestAndImport = JOB_OP_TYPE_HARVEST_AND_IMPORT;
  jobHarvestWorship = JOB_OP_TYPE_HARVEST_WORSHIP;
  jobHarvestWorshipAndImport = JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT;

  jobOperations = [
    { label: 'Harvest URL', uri: this.jobHarvest },
    { label: 'Harvest & Publish', uri: this.jobHarvestAndImport },
    { label: 'Harvest Worship', uri: this.jobHarvestWorship },
    {
      label: 'Harvest Worship & Publish',
      uri: this.jobHarvestWorshipAndImport,
    },
  ];

  harvesTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/collecting';
  importTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/publishHarvestedTriples';

  creator = JOB_CREATOR_SELF_SERVICE;

  securitySchemesOptions = [BASIC_AUTH, OAUTH2];

  @tracked title;
  @tracked url;
  @tracked graphName;
  @tracked success = false;
  @tracked error = false;
  @tracked errorMessage;
  @tracked selectedJobOperation;
  @tracked cronPattern = '*/5 * * * *';
  @tracked selectedSecurityScheme;
  @tracked securityScheme = {};
  @tracked credentials = {};

  get cronDescription() {
    const isValidCronExpression = isValidCron(this.cronPattern);

    if (isValidCronExpression) {
      return cronstrue.toString(this.cronPattern, {
        use24HourTimeFormat: true,
      });
    } else {
      return 'This is not a valid cron pattern';
    }
  }

  get isValidCron() {
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
  async createScheduledJob() {
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
    });

    const remoteDataObject = this.store.createRecord('remote-data-object', {
      source: this.url,
      status:
        'http://lblod.data.gift/file-download-statuses/ready-to-be-cached',
      requestHeader: 'http://data.lblod.info/request-headers/accept/text/html',
      created: this.currentTime,
      modified: this.currentTime,
      creator: this.creator,
      //TODO: authentication configuration doesn't work currently for scheduled jobs. Because
      // - Shallow copy of authtentication configuration (see DL-4896)
      // - See timing issue comments, in controllers/jobs/new.js
      authenticationConfiguration: this.selectedSecurityScheme
        ? await createAuthenticationConfiguration(
            this.selectedSecurityScheme,
            this.securityScheme,
            this.credentials,
            this.store
          )
        : null, // authenticationConfiguration is optional
    });

    const collection = this.store.createRecord('harvesting-collection', {
      creator: this.creator,
      remoteDataObjects: [remoteDataObject],
    });

    const dataContainer = this.store.createRecord('data-container', {
      harvestingCollections: [collection],
    });

    const scheduledTasks = this.store.createRecord('scheduled-task', {
      created: this.currentTime,
      modified: this.currentTime,
      operation: this.harvesTaskOperation,
      index: '0',
      inputContainers: [dataContainer],
      scheduledJob: scheduledJob,
    });

    try {
      await cronSchedule.save();
      await scheduledJob.save();
      await remoteDataObject.save();
      await collection.save();
      await dataContainer.save();
      await scheduledTasks.save();
      this.error = false;
      this.success = true;
    } catch (err) {
      this.errorMessage = err;
      this.success = false;
      this.error = true;
    }
  }
}
