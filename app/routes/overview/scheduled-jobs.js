import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class OverviewScheduledJobsRoute extends Route {
  @service store;

  modelName = 'scheduled-job';

  queryParams = {
    search: { refreshModel: true },
    sort: { refreshModel: true },
    page: { refreshModel: true },
  };

  async model(params) {
    const filters = {};
    if (params.search) {
      filters.title = params.search;
    }
    return this.store.query(this.modelName, {
      include: 'schedule',
      filters,
      page: {
        number: params.page,
        size: params.size,
      },
      sort: params.sort ? params.sort : 'created',
    });
  }

  @action
  async loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor(this.routeName);
    controller.set('currentlyLoading', true);
    transition.promise.finally(function () {
      controller.set('currentlyLoading', false);
    });
  }
}
