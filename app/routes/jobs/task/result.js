import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsTaskResultRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'file';

  // NOTE: this should be changed later when model is definite. Now just take the first containers & first harvestingCollection

  async beforeModel(){
    this.taskId = await this.modelFor('jobs.task').id;
  }

  mergeQueryOptions() {
    return {
      include: 'data-container',
      'filter[data-container][result-from-tasks][:id:]': this.taskId,
      sort: '-created'
    };
  }
}