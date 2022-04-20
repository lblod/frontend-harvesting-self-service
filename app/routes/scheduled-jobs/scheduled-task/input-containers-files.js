import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class ScheduledJobsScheduledTaskInputContainersFilesRoute extends Route.extend(
  DataTableRouteMixin
) {
  modelName = 'file';

  async beforeModel() {
    this.taskId = await this.modelFor('scheduled-jobs.scheduled-task').id;
  }

  mergeQueryOptions(param) {
    return {
      'filter[data-container][input-from-tasks][:id:]': this.taskId,
      sort: param.sort,
    };
  }
}
