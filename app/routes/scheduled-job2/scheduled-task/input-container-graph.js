import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class ScheduledJob2ScheduledTaskInputContainerGraphRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'file';

  async beforeModel() {
    this.task = await this.modelFor('scheduled-job2.scheduled-task');
  }

  mergeQueryOptions(param) {
    return {
      'filter[data-container][input-from-tasks][:id:]': this.task.id,
      sort: param.sort,
    };
  }
}
