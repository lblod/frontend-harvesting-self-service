import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OverviewScheduledJobsDetailsExecutionsRoute extends Route {
  @service store;

  queryParams = {
    execPage: { refreshModel: true },
    execSize: { refreshModel: true },
    execSort: { refreshModel: true },
    execStatus: { refreshModel: true },
    operation: { refreshModel: true, replace: true },
  };

  async model(params) {
    const scheduledJob = await this.modelFor('overview.scheduled-jobs.details');
    const options = {
      sort: params.execSort,
      page: {
        number: params.execPage,
        size: params.execSize,
      },
      'filter[creator]': scheduledJob.uri,
    };
    if (params.execStatus) {
      options['filter[:exact:status]'] = params.execStatus;
    }
    if (params.operation) {
      options['filter[:exact:operation]'] = params.operation;
    }
    return this.store.query('job', options);
  }
}
