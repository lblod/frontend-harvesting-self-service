import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class JobTaskResultsContainerHarvestingCollectionsRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

  modelName = 'remote-data-object';

  async beforeModel() {
    this.task = (await this.modelFor('job.task')).task;
  }

  mergeQueryOptions(param) {
    return {
      'filter[harvesting-collection][data-container][result-from-tasks][:id:]':
        this.task.id,
      sort: param.sort,
    };
  }
}
