import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isValidCron } from 'cron-validator'
import cronstrue from 'cronstrue';

export default class ScheduledJobsNewController extends Controller {
  jobHarvest = 'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvesting';
  jobHarvestAndImport = 'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestAndPublish';

  jobOperations = [
    { label: 'Harvest URL', uri: this.jobHarvest },
    { label: 'Harvest & Publish', uri: this.jobHarvestAndImport }
  ];

  harvesTaskOperation = 'http://lblod.data.gift/id/jobs/concept/TaskOperation/collecting';
  importTaskOperation = 'http://lblod.data.gift/id/jobs/concept/TaskOperation/publishHarvestedTriples';

  creator = 'http://lblod.data.gift/services/job-self-service';

  @tracked title;
  @tracked url;
  @tracked graphName;
  @tracked success = false;
  @tracked error = false;
  @tracked errorMessage;
  @tracked selectedJobOperation;
  @tracked cronPattern = "*/5 * * * *";

  get cronDescription() {
    const isValidCronExpression = isValidCron(this.cronPattern);

    if (isValidCronExpression) {
      return cronstrue.toString(this.cronPattern, { use24HourTimeFormat: true });
    } else {
      return "This is not a valid cron pattern";
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
  setJobOperation(selected){
    this.selectedJobOperation = selected;
  }

  @action
  async createScheduledJob() {
    const cronSchedule = this.store.createRecord('cron-schedule', {
      repeatFrequency: this.cronPattern
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

    const scheduledTasks = this.store.createRecord('scheduled-task', {
      created: this.currentTime,
      modified: this.currentTime,
      operation: this.harvesTaskOperation,
      index: '0',
      inputContainers: [ dataContainer ],
      scheduledJob: scheduledJob
    });

    try{
      await cronSchedule.save();
      await scheduledJob.save();
      await remoteDataObject.save();
      await collection.save();
      await dataContainer.save();
      await scheduledTasks.save();
      this.error = false;
      this.success = true;

    }
    catch(err){
      this.errorMessage = err;
      this.success = false;
      this.error = true;
    }
  }
}
