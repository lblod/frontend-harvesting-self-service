import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { isValidCron } from 'cron-validator';
import cronstrue from 'cronstrue';

export default class ScheduledJobsDetailsController extends Controller {

  @tracked newCronPattern = "*/5 * * * *";
  @tracked popup = false;

  get currentCronDescription() {
    const frequency = this.model.schedule.get('repeatFrequency');
    if(frequency) {
      return cronstrue.toString(frequency);
    } else {
      return "";
    }
  }

  get newCronDescription() {
    const isValidCronExpression = isValidCron(this.newCronPattern);

    if (isValidCronExpression) {
      return cronstrue.toString(this.newCronPattern, { use24HourTimeFormat: true });
    } else {
      return "This is not a valid cron pattern";
    }
  }

  get isValidCron() {
    return isValidCron(this.newCronPattern);
  }

  @task
  *deleteJob(scheduledJob){
    //Delete top level down the tree, less confusing if something fails.

    //NOTE: Even though inputContainers & resultsContainers have the same nested structure, I duplicated the code since I know you like the seperation more then a wrapping |for| loop
    const scheduledTasks = yield scheduledJob.scheduledTasks;
    yield scheduledJob.destroyRecord();

    for(let task of scheduledTasks.toArray()) {
      const iContainers = yield task.inputContainers;
      yield task.destroyRecord();

      for(let input of iContainers.toArray()){
        const fileList = yield input.files;
        const collectionList = yield input.harvestingCollections;
        yield input.destroyRecord();

        for(let file of fileList.toArray()){
          //NOTE: file model gets found but cannot get physical file in backend to delete
          yield file.destroyRecord();
        }

        for(let collection of collectionList.toArray()){
          const rObjs = yield collection.remoteDataObjects;
          yield collection.destroyRecord();

          for(let rObj of rObjs.toArray()){
            yield rObj.destroyRecord();
          }
        }
      }
        this.transitionToRoute('scheduled-jobs.index');
    }
  }

  @task
    *saveNewCronPattern(scheduledJob) {
      const oldCronPattern = scheduledJob.schedule.get('repeatFrequency');

      if(oldCronPattern == this.newCronPattern) {
        this.popup = false;
      }

      const currentSchedule = yield scheduledJob.schedule;
      yield currentSchedule.set('repeatFrequency', this.newCronPattern);
      yield currentSchedule.save();
      this.popup = false;

    }
}
