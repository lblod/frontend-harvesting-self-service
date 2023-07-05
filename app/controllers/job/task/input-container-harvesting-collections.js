import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class JobTaskInputContainerHarvestingCollectionsController extends Controller {
  sort = '';
  page = 0;
  size = 15;
  @action
  overrideClick(e) {
    e.stopPropagation();
  }
}
