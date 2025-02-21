import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class OverviewScheduledJobsRoute extends Route.extend(
  DataTableRouteMixin
) {
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
    const scheduledJobs = await this.store.query(this.modelName, {
      include: 'schedule',
      filters,
      page: {
        number: params.page,
        size: params.size,
      },
      sort: params.sort ? params.sort : 'created',
    });
    return {
      scheduledJobs,
      search: params.search,
    };
  }

  mergeQueryOptions(param) {
    return {
      sort: param.sort,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    if (model.search) {
      controller.searchValue = model.search;
    }
  }
}
