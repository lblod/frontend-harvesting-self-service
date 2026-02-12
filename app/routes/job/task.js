import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JobTaskRoute extends Route {
  @service store;

  async beforeModel() {
    this.job = this.modelFor('job');
  }

  async model(param) {
    const taskId = param.task_id;
    this.counts = {
      inputContainerFiles: await this.store.count('file', {
        'filter[data-container][input-from-tasks][:id:]': taskId,
      }),
      resultContainerFiles: await this.store.count('file', {
        'filter[data-container][result-from-tasks][:id:]': taskId,
      }),
      inputContainerGraphs: await this.store.count('data-container', {
        'filter[input-from-tasks][:id:]': taskId,
        'filter[has-graph]': 'http://',
      }),
      resultContainerGraphs: await this.store.count('data-container', {
        'filter[result-from-tasks][:id:]': taskId,
        'filter[has-graph]': 'http://',
      }),
      inputContainerHarvestingCollections: await this.store.count(
        'remote-data-object',
        {
          'filter[harvesting-collection][data-container][input-from-tasks][:id:]':
            taskId,
        },
      ),
      resultContainerHarvestingCollections: await this.store.count(
        'remote-data-object',
        {
          'filter[harvesting-collection][data-container][result-from-tasks][:id:]':
            taskId,
        },
      ),
      resultResourceContainers: await this.store.count('data-container', {
        'filter[result-from-tasks][:id:]': taskId,
        'filter[:has:has-resource]': true,
      }),
      inputResourceContainers: await this.store.count('data-container', {
        'filter[input-from-tasks][:id:]': taskId,
        'filter[:has:has-resource]': true,
      }),
    };
    let total = 0;
    Object.keys(this.counts).forEach((key) => {
      total += this.counts[key];
    });
    this.counts.total = total;

    return this.store.findRecord('task', taskId);
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
    controller.set('counts', this.counts);
  }
}
