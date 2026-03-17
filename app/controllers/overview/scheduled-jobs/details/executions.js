import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class OverviewScheduledJobsDetailsExecutionsController extends Controller {
  @tracked execPage = 0;
  @tracked execSort = '-created';
  @tracked execStatus;

  @service router;

  execSize = 15;

  queryParams = ['execPage', 'execSize', 'execStatus', 'execSort'];

  @action
  reload() {
    this.router.refresh('overview.scheduled-jobs.details.executions');
  }
}
