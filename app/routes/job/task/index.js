import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class JobTaskIndexRoute extends Route {
  @service('router') router;
  afterModel() {
    const task = this.modelFor('job.task');

    if (
      task.operation ===
      'http://lblod.data.gift/id/jobs/concept/TaskOperation/collecting'
    ) {
      this.router.transitionTo(
        'job.task.input-container-harvesting-collections',
      );
    } else {
      this.router.transitionTo('job.task.input-container-files');
    }
  }
}
