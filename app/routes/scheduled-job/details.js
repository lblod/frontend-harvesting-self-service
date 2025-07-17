import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class ScheduledJobDetailsRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  queryParams = {
    page: { refreshModel: true, replace: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  modelName = 'scheduled-task';

  async beforeModel() {
    this.job = this.modelFor('scheduled-job');
  }

  mergeQueryOptions(params) {
    return {
      include: 'scheduled-job',
      'filter[scheduled-job][:id:]': this.job.id,
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
