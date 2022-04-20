import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class JobsTaskResultController extends Controller {
  sort = '-created';
  page = 0;
  size = 15;

  @action
  overrideClick(e) {
    e.stopPropagation();
  }
}
