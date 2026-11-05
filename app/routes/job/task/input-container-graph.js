import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JobTaskInputContainerGraphRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async beforeModel() {
    this.task = await this.modelFor('job.task');
  }

  model(params) {
    return this.store.query('data-container', {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      'filter[input-from-tasks][:id:]': this.task.id,
      //this is a little hack
      // we can't use :has: filter oon property in mu-resource
      // Eventually this will be cleaned up if we have inheritance in mu-resource
      'filter[has-graph]': 'http://',
    });
  }
}
