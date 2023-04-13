import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class OverviewJobsController extends Controller {
  @tracked page = 0;
  @tracked sort = '-created';
  @tracked status;

  @service router;

  size = 15;

  queryParams = ['page', 'size', 'status', 'sort'];

  @action
  reload() {
    this.router.refresh('overview.jobs');
  }
}
