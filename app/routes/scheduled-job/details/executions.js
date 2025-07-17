import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class ScheduledJobDetailsExecutionsRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'job';

  queryParams = {
    'exec-page': { refreshModel: true, replace: true },
    'exec-size': { refreshModel: true },
    'exec-sort': { refreshModel: true },
    'exec-status': { refreshModel: true },
  };

  model(params) {
    // Call parent model method with additional filtering
    return super.model(params);
  }

  mergeQueryOptions(params) {
    const scheduledJob = this.modelFor('scheduled-job');

    const options = {
      sort: params['exec-sort'],
      page: { number: params['exec-page'], size: params['exec-size'] },
      include: 'tasks',
      'filter[creator]': scheduledJob.uri,
    };

    if (params['exec-status']) {
      options['filter[:exact:status]'] = params['exec-status'];
    }

    return options;
  }
}
