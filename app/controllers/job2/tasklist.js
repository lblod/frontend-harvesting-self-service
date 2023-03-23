import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class Job2TasklistController extends Controller {
  sort = '-index';
  page = 0;
  size = 15;

  @action
  overrideClick(e) {
    e.stopPropagation();
  }
}

