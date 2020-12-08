import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
  modelName: 'remote-data-object',

  mergeQueryOptions() {
    return {
     'filter[harvesting-collection][:id:]': this.modelFor('harvest/details').harvestingCollection.get("id")
    };
  },

})