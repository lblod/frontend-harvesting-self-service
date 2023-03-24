import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class Job2TaskResultsContainerFilesRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'file';

  async beforeModel() {
    this.task = await this.modelFor('job2.task');
  }

  mergeQueryOptions(param) {
    return {
      'filter[data-container][result-from-tasks][:id:]': this.task.id,
      sort: param.sort,
    };
  }
}
