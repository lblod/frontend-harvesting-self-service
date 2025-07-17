import Route from '@ember/routing/route';

export default class OverviewScheduledJobsDetailsIndexRoute extends Route {
  async model() {
    return await this.modelFor('overview.scheduled-jobs.details');
  }
}
