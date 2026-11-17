import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class OverviewJobsRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true, replace: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    status: { refreshModel: true },
    operation: { refreshModel: true, replace: true },
  };

  model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };

    if (params.status) {
      options['filter[:exact:status]'] = params.status;
    }
    if (params.operation) {
      options['filter[:exact:operation]'] = params.operation;
    }

    return this.store.query('job', options);
  }
}
