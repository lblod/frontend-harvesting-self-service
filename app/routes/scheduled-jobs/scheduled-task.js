import Route from '@ember/routing/route';

export default class ScheduledJobsScheduledTaskRoute extends Route {
  model(param) {
    return this.store.findRecord('scheduled-task', param.id);
  }
}
