import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class JobTaskResultsContainerResourceRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

  modelName = 'data-container';

  async beforeModel() {
    this.task = await this.modelFor('job.task');
  }

  mergeQueryOptions(param) {
    return {
      'filter[result-from-tasks][:id:]': this.task.id,
      sort: param.sort,
    };
  }
}
