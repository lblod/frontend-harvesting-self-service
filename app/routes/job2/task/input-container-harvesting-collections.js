import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class Job2TaskInputContainerHarvestingCollectionsRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'remote-data-object';

  async beforeModel() {
    this.task = await this.modelFor('job2.task');
  }

  mergeQueryOptions(param) {
    return {
      'filter[harvesting-collection][data-container][input-from-tasks][:id:]':
        this.task.id,
      sort: param.sort,
    };
  }
}
