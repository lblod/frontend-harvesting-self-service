import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ScheduledJobScheduledTaskInputContainerHarvestingCollectionsController extends Controller {
  @action
  overrideClick(e) {
    e.stopPropagation();
  }
}
