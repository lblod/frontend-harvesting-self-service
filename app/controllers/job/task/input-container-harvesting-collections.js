import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class JobTaskInputContainerHarvestingCollectionsController extends Controller {
  @action
  overrideClick(e) {
    e.stopPropagation();
  }
}
