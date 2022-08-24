import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
export default class JobsIndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'job';

  queryParams = {
    page: { refreshModel: true, replace: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    status: { status: this.shortStatus, refreshModel: true },
  };

  mergeQueryOptions(param) {
    return {
      'filter[status]': param.status,
      sort: param.sort,
      page: { number: param.number, size: param.size },
      include: 'tasks',
    };
  }

}
