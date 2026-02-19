import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class JobTaskInputContainerResourceRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

  modelName = 'data-container';

  async beforeModel() {
    this.task = (await this.modelFor('job.task')).task;
  }

  mergeQueryOptions(param) {
    return {
      'filter[result-from-tasks][:id:]': this.task.id,
      sort: param.sort,
    };
  }
}
