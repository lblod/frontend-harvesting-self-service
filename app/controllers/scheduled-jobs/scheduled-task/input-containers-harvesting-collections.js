import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ScheduledJobsScheduledTaskInputContainersHarvestingCollectionsController extends Controller {
  @action
  overrideClick(e){
    e.stopPropagation();
  }
}
