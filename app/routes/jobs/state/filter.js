import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsStateFilterRoute extends Route.extend(
  DataTableRouteMixin
) {
  modelName = 'job';

  queryParams = {
    page: { refreshModel: true },
    sort: { refreshModel: true },
    status: { status: this.shortStatus },
  };

  mergeQueryOptions(param) {
    return {
      'filter[status]': param.status,
      sort: param.sort,
    };
  }
}
