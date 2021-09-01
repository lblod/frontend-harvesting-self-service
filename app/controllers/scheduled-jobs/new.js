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
      return "This is not a valid cron pattern"
    }
  }

  get currentTime() {
    const timestamp = new Date();
    return timestamp;
  }

  @action
  setJobOperation(selected){
    this.selectedJobOperation = selected;
  }
}
