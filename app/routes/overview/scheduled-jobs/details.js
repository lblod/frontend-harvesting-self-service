import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OverviewScheduledJobsDetailsRoute extends Route {
  @service store;

  async model(params) {
    const job = await this.store.findRecord('scheduled-job', params.job_id);
    return job;
  }
}
