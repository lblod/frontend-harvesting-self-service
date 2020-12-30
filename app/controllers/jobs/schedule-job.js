import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class JobsScheduleJobController extends Controller {
  creator = 'http://lblod.data.gift/services/job-self-service';
  harvesTaskType = 'http://lblod.data.gift/id/jobs/concept/TaskOperation/collecting';
  harvestJobType = 'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvesting';
  @tracked url;
  @tracked success = false;
  @tracked error = false;
  @tracked errorMessage;

  get currentTime() {
    const timestamp = new Date();
    return timestamp;
  }

  @action
  async scheduleJob(){
    const scheduledJob = this.store.createRecord('job', {
      status: 'http://redpencil.data.gift/id/concept/JobStatus/busy',
      created: this.currentTime,
      modified: this.currentTime,
      creator: this.creator,
      operation: this.harvestJobType
    });

    const remoteDataObject = this.store.createRecord('remote-data-object', {
      source: this.url,
      status: 'http://lblod.data.gift/file-download-statuses/ready-to-be-cached',
      requestHeader: 'http://data.lblod.info/request-headers/accept/text/html',
      created: this.currentTime,
      modified: this.currentTime,
      creator: this.creator
    });

    const collection = this.store.createRecord('harvesting-collection', {
      creator: this.creator,
      remoteDataObjects: [ remoteDataObject ]
    });

    const dataContainer = this.store.createRecord('data-container', {
      harvestingCollections: [ collection ]
    });

    const task = this.store.createRecord('task', {
      status: 'http://redpencil.data.gift/id/concept/JobStatus/scheduled',
      created: this.currentTime,
      modified: this.currentTime,
      operation: this.harvesTaskType,
      index: '0',
      inputContainers: [ dataContainer ],
      job: scheduledJob
    });
    try{
      await scheduledJob.save();
      await remoteDataObject.save();
      await collection.save();
      await dataContainer.save();
      await task.save();
      this.error = false;
      this.success = true;

    }catch(err){
      this.errorMessage = err;
      this.success = false;
      this.error = true;
    }
  }
}
