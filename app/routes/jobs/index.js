import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
export default class JobsIndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'job';

  queryParams = {
    page: { refreshModel: true, replace: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    status: { refreshModel: true },
  };

  statusOptions = [
    'http://redpencil.data.gift/id/concept/JobStatus/success', 
    'http://redpencil.data.gift/id/concept/JobStatus/busy', 
    'http://redpencil.data.gift/id/concept/JobStatus/scheduled', 
    'http://redpencil.data.gift/id/concept/JobStatus/failed', 
    'http://redpencil.data.gift/id/concept/JobStatus/canceled'
  ];

  setOptions = ['Success', 'Busy', 'Scheduled', 'Failed', 'Canceled']

  mergeQueryOptions(param) {
    const options = {
      sort: param.sort,
      page: { number: param.number, size: param.size },
      include: 'tasks'
    };

    if (param.status) {
      options['filter[:exact:status]'] = param.status;
    }

    return options;

  }
}
