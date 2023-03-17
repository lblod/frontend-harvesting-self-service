import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ScheduledJobsScheduledTaskRoute extends Route {
  @service store;

  model(param) {
    return this.store.findRecord('scheduled-task', param.id);
  }
}
