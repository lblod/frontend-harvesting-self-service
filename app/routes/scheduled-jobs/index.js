import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class ScheduledJobsIndexRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'scheduled-job';

  mergeQueryOptions(param) {
    return {
      sort: param.sort,
    };
  }
}
