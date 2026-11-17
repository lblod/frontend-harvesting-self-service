import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JobTaskResultsContainerResourceRoute extends Route {
  @service store;

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  async beforeModel() {
    this.task = (await this.modelFor('job.task')).task;
  }

  model(params) {
    return this.store.query('data-container', {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      'filter[result-from-tasks][:id:]': this.task.id,
    });
  }
}
