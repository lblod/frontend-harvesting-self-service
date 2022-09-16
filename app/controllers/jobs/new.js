import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {
  JOB_OP_TYPE_CREATE,
  JOB_OP_TYPE_HARVEST,
  JOB_OP_TYPE_HARVEST_AND_IMPORT,
  JOB_OP_TYPE_IMPORT,
  JOB_CREATOR_SELF_SERVICE,
} from '../../utils/constants';

export default class JobsNewController extends Controller {
  jobHarvest = JOB_OP_TYPE_HARVEST;
  jobImport = JOB_OP_TYPE_IMPORT;
  jobHarvestAndImport = JOB_OP_TYPE_HARVEST_AND_IMPORT;

  jobOperations = Array.from(JOB_OP_TYPE_CREATE).map(([key, value]) => {
      return { label: value, uri: key }
    } 
  );

  creator = JOB_CREATOR_SELF_SERVICE;

  harvestTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/collecting';
  importTaskOperation =
    'http://lblod.data.gift/id/jobs/concept/TaskOperation/publishHarvestedTriples';

  @tracked url;
  @tracked graphName;
  @tracked success = false;
  @tracked error = false;
  @tracked errorMessage;
  @tracked comment;
  @tracked selectedJobOperation;

  get currentTime() {
    const timestamp = new Date();
    return timestamp;
  }

  @action
  setJobOperation(selected) {
    this.selectedJobOperation = selected;
  }

  @action
  async scheduleHarvestJob() {
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
      status:
        'http://lblod.data.gift/file-download-statuses/ready-to-be-cached',
      requestHeader: 'http://data.lblod.info/request-headers/accept/text/html',
      created: this.currentTime,
      modified: this.currentTime,
      creator: this.creator,
    });

    const collection = this.store.createRecord('harvesting-collection', {
      creator: this.creator,
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
      this.error = false;
      this.success = true;
    } catch (err) {
      this.errorMessage = err;
      this.success = false;
      this.error = true;
    }
  }

  @action
  async scheduleImportJob() {
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
      this.error = false;
      this.success = true;
    } catch (err) {
      this.errorMessage = err;
      this.success = false;
      this.error = true;
    }
  }
}
