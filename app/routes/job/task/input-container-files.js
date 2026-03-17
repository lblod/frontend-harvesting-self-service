import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class JobTaskInputContainerFilesRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

  modelName = 'file';

  async beforeModel() {
    this.task = (await this.modelFor('job.task')).task;
  }

  mergeQueryOptions(param) {
    return {
      'filter[data-container][input-from-tasks][:id:]': this.task.id,
      sort: param.sort,
    };
  }
}
