import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class JobTaskInputContainerHarvestingCollectionsRoute extends Route {
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
    return this.store.query('remote-data-object', {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      'filter[harvesting-collection][data-container][input-from-tasks][:id:]':
        this.task.id,
    });
  }
}
