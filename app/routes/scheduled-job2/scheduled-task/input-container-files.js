import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class ScheduledJob2ScheduledTaskInputContainerFilesRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'remote-data-object';

  async beforeModel() {
    this.task = await this.modelFor('scheduled-job2.scheduled-task');
  }

  mergeQueryOptions(param) {
    return {
      'filter[harvesting-collection][data-container][input-from-tasks][:id:]':
        this.task.id,
      sort: param.sort,
    };
  }
}
