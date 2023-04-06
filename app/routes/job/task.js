import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JobTaskRoute extends Route {
  @service store;

  async beforeModel() {
    this.job = this.modelFor('job');
  }

  model(param) {
    return this.store.findRecord('task', param.task_id);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
