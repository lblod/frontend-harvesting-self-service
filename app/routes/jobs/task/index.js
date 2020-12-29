import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsTaskIndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'remote-data-object';

  async beforeModel(){
    const container = await this.modelFor('jobs.task').inputContainers;
    this.collection = container.firstObject.harvestingCollections
  };

  mergeQueryOptions() {
    return {
      include: 'harvesting-collection',
      'filter[harvesting-collection][:id:]': this.collection.id,
      sort: '-created'
    };
  }
}