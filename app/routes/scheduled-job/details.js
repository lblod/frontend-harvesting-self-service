import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class ScheduledJobDetailsRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'scheduled-task';

  async beforeModel() {
    this.job = this.modelFor('scheduled-job');
  }

  mergeQueryOptions(param) {
    return {
      include: 'scheduled-job',
      'filter[scheduled-job][:id:]': this.job.id,
      sort: param.sort,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
