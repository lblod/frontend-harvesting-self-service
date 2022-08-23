import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { tracked } from '@glimmer/tracking';

export default class JobsIndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'job';

  mergeQueryOptions(param) {
    return {
      sort: param.sort,
      include: 'tasks',
    };
  }

  queryParams = ['status']
  //@tracked status = null

}
