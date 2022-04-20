import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsIndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'job';

  mergeQueryOptions(param) {
    return {
      sort: param.sort,
      include: 'tasks'
    };
  }
}
