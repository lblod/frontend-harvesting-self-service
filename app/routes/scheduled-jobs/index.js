import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class ScheduledJobsIndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'scheduled-job';

  mergeQueryOptions(param) {
    return {
      sort: param.sort
    };
  }
}
