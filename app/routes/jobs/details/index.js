import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
  modelName: 'remote-data-object',

  async beforeModel(){
    this.harvestinCollection = await this.modelFor('harvest.details').harvestingCollection;
  },

  mergeQueryOptions() {
    return {
      include: 'harvesting-collection',
      'filter[harvesting-collection][:id:]': this.harvestinCollection.id,
      sort: '-created'
    };
  }
});
