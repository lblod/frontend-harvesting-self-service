import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ScheduledJob2ScheduledTaskInputContainerHarvestingCollectionsController extends Controller {
  @action
  overrideClick(e) {
    e.stopPropagation();
  }
}
