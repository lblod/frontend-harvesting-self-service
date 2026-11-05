import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JobTasklistRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async beforeModel() {
    this.job = this.modelFor('job');
  }

  model(params) {
    return this.store.query('task', {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      include: 'job',
      'filter[job][:id:]': this.job.id,
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
