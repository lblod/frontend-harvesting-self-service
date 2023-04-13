import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class JobTaskResultsContainerGraphRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'data-container';

  async beforeModel() {
    this.task = await this.modelFor('job.task');
  }

  mergeQueryOptions(param) {
    return {
      'filter[result-from-tasks][:id:]': this.task.id,
      //this is a little hack
      // we can't use :has: filter oon property in mu-resource
      // Eventually this will be cleaned up if we have inheritance in mu-resource
      'filter[has-graph]': 'http://',
      sort: param.sort,
    };
  }
}
