import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class OverviewJobsErrorController extends Controller {
  @service router;

  @action
  retry() {
    this.router.transitionTo('overview.jobs');
  }
}
