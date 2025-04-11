import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ScheduledJobDetailsRoute extends Route {
  @service store;

  queryParams = {
    search: { refreshModel: true },
    sort: { refreshModel: true },
    page: { refreshModel: true },
  };

  modelName = 'scheduled-task';

  async beforeModel() {
    this.job = this.modelFor('scheduled-job');
  }

  async model(params) {
    return this.store.query(this.modelName, {
      include: 'scheduled-job',
      'filter[scheduled-job][:id:]': this.job.id,
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
