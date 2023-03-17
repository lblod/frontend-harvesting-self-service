import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class JobsTaskInputRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'file';

  async beforeModel() {
    this.taskId = await this.modelFor('jobs.task').id;
  }

  mergeQueryOptions(param) {
    return {
      'filter[data-container][input-from-tasks][:id:]': this.taskId,
      sort: param.sort,
    };
  }
}
