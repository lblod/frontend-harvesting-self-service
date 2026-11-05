import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JobTaskInputContainerFilesRoute extends Route {
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
    return this.store.query('file', {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      'filter[data-container][input-from-tasks][:id:]': this.task.id,
    });
  }
}
