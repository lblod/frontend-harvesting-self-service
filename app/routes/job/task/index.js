import Route from '@ember/routing/route';

export default class JobTaskIndexRoute extends Route {
  afterModel() {
    const task = this.modelFor('job.task');

    if (
      task.operation ===
      'http://lblod.data.gift/id/jobs/concept/TaskOperation/collecting'
    ) {
      this.transitionTo('job.task.input-container-harvesting-collections');
    } else {
      this.transitionTo('job.task.input-container-files');
    }
  }
}
