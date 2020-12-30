import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsTaskInputRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'file';

  // NOTE: this should be changed later when model is definite. Now just take the first containers & first harvestingCollection

  async beforeModel(){
    this.taskId = await this.modelFor('jobs.task').id;
  }

  mergeQueryOptions(param) {
    return {
      'filter[data-container][input-from-tasks][:id:]': this.taskId,
      sort: param.sort
    };
  }
}
