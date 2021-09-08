import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class ScheduledJobsScheduledTaskInputContainersHarvestingCollectionsRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'remote-data-object';

  async beforeModel(){
    this.taskId = await this.modelFor('scheduled-jobs.scheduled-task').id;
  }

  mergeQueryOptions(param) {
    return {
      'filter[harvesting-collection][data-container][input-from-tasks][:id:]': this.taskId,
      sort: param.sort
    };
  }
}
