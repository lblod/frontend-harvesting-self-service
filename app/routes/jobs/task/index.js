import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsTaskIndexRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'remote-data-object';

  // NOTE: this should be changed later when model is definite. Now just take the first containers & first harvestingCollection

  async beforeModel(){
    let container = await this.modelFor('jobs.task').inputContainers;
    let firstContainer = await container.firstObject
    let collection = await firstContainer.harvestingCollections
    let firstCollection = await collection.firstObject
    this.collectionId = firstCollection.id
  };

  mergeQueryOptions() {
    return {
      include: 'harvesting-collection',
      'filter[harvesting-collection][:id:]': this.collectionId,
      sort: '-created'
    };
  }
}