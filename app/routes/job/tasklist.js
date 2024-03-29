import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class JobTasklistRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'task';

  async beforeModel() {
    this.job = this.modelFor('job');
  }

  mergeQueryOptions(param) {
    return {
      include: 'job',
      'filter[job][:id:]': this.job.id,
      sort: param.sort,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
