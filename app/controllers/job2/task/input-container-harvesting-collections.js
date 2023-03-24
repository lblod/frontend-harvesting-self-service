import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class Job2TaskInputContainerHarvestingCollectionsController extends Controller {
  @action
  overrideClick(e) {
    e.stopPropagation();
  }
}
