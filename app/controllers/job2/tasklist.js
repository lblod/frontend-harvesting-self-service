import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class Job2TasklistController extends Controller {
  sort = '-index';
  page = 0;
  size = 15;

  @tracked job;

  @action
  overrideClick(e) {
    e.stopPropagation();
  }
}
