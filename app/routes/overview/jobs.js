import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class OverviewJobsRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

  modelName = 'job';

  queryParams = {
    page: { refreshModel: true, replace: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    status: { refreshModel: true },
    operation: { refreshModel: true, replace: true },
  };

  mergeQueryOptions(param) {
    const options = {
      sort: param.sort,
      page: { number: param.number, size: param.size },
      //include: 'tasks',
    };

    if (param.status) {
      options['filter[:exact:status]'] = param.status;
    }
    if (param.operation) {
      options['filter[:exact:operation]'] = param.operation;
    }

    return options;
  }
}
