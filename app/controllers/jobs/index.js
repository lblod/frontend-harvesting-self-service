import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class JobsIndexController extends Controller {
  @tracked page = 0;
  @tracked sort = '-created';
  @tracked status = null;
  size = 15;

  queryParams = ['page', 'size', 'status', 'sort'];
}
