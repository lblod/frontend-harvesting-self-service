import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JobsTaskRoute extends Route {
  @service store;

  model(param) {
    return this.store.findRecord('task', param.taskId);
  }
}
