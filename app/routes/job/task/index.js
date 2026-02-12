import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class JobTaskIndexRoute extends Route {
  @service('router') router;
  afterModel() {
    const task = this.modelFor('job.task');

    if (task.counts.inputContainerFiles > 0) {
      this.router.transitionTo('job.task.input-container-files');
    } else if (task.counts.resultContainerFiles > 0) {
      this.router.transitionTo('job.task.result-container-files');
    } else if (task.counts.inputContainerGraphs > 0) {
      this.router.transitionTo('job.task.input-container-graphs');
    } else if (task.counts.resultContainerGraphs > 0) {
      this.router.transitionTo('job.task.results-container-graphs');
    } else if (task.counts.inputContainerHarvestingCollections > 0) {
      this.router.transitionTo(
        'job.task.input-container-harvesting-collections',
      );
    } else if (task.counts.resultContainerHarvestingCollections > 0) {
      this.router.transitionTo(
        'job.task.result-container-harvesting-collections',
      );
    } else if (task.counts.inputResourceContainers > 0) {
      this.router.transitionTo('job.task.input-container-resource');
    } else if (task.counts.resultResourceContainers > 0) {
      this.router.transitionTo('job.task.results-container-resource');
    }
  }
}
