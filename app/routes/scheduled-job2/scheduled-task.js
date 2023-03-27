import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ScheduledJob2ScheduledTaskRoute extends Route {
  @service store;

  async beforeModel() {
    this.job = this.modelFor('scheduled-job2');
  }

  model(param) {
    return this.store.findRecord('scheduled-task', param.task_id);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
