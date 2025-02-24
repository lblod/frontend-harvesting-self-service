import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

export default class OverviewScheduledJobsController extends Controller {
  queryParams = ['page', 'sort', 'size', 'search'];

  size = 15;
  @tracked page = 0;
  @tracked sort = '-created';
  @tracked search = '';

  updateSearchQuery = task({ restartable: true }, async (value) => {
    await timeout(500);
    this.page = 0;
    this.sort = '-created';
    this.search = value.trimStart();
  });
}
