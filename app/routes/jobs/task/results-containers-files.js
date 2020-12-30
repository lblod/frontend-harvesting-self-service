import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsTaskResultRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'file';

  async beforeModel(){
    this.taskId = await this.modelFor('jobs.task').id;
  }

  mergeQueryOptions(param) {
    return {
      'filter[data-container][result-from-tasks][:id:]': this.taskId,
      sort: param.sort
    };
  }
}
