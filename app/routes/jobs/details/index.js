import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
  modelName: 'task',

  async beforeModel(){
    this.job = await this.modelFor('jobs.details').id;
  },

  mergeQueryOptions() {
    return {
      include: 'job',
      'filter[job][:id:]': this.job,
      sort: '-created'
    };
  }
});
