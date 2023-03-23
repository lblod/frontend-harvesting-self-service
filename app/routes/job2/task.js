import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class Job2TaskRoute extends Route {
  @service store;

  async beforeModel() {
    this.job = this.modelFor('job2');
  }

  model(param) {
    return this.store.findRecord('task', param.taskId);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
