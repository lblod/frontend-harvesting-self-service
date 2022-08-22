import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsFilterRoute extends Route.extend(
    DataTableRouteMixin
  ) {
    modelName = 'job';
  
    queryParams = {
      page: { refreshModel: true },
      size: { refreshModel: true },
      sort: { refreshModel: true },
      status: { status: this.shortStatus },
    };
  
    mergeQueryOptions(param) {
      return {
        'filter[status]': param.status,
        sort: param.sort,
        page: { numer: param.number, size: param.size },
      };
    }
  }
  
