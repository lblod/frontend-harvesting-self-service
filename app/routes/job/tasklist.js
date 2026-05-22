import Route from '@ember/routing/route';
// eslint-disable-next-line ember/no-mixins
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class JobTasklistRoute extends Route.extend(
  DataTableRouteMixin,
) {
  @service store;

  modelName = 'task';

  queryParams = {
    page: { refreshModel: true, replace: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    status: { refreshModel: true },
    operation: { refreshModel: true, replace: true },
  };

  async beforeModel() {
    this.job = this.modelFor('job');
  }

  async model() {
    const taskList = await super.model(...arguments);
    const statusCounts = {};
    await Promise.all(
      Object.keys(this.job.statusesMap).map(async (status) => {
        const tasks = await this.store.query('task', {
          'filter[job][:id:]': this.job.id,
          'filter[status][:uri:]': status,
          page: { size: 1 },
        });
        if (tasks.meta.count == 0) {
          return;
        }
        statusCounts[status] = {
          status,
          count: tasks.meta.count,
          statusName: this.job.statusesMap[status],
        };
      }),
    );
    const statusCountList = Object.keys(this.job.statusesMap)
      .map((status) => {
        return statusCounts[status];
      })
      .filter((s) => !!s);
    
    return {
      tasks: taskList,
      statusCounts: statusCountList,
    };
  }

  mergeQueryOptions(param) {
    const options = {
      include: 'job',
      'filter[job][:id:]': this.job.id,
      sort: param.sort,
    };

    if (param.status) {
      options['filter[:exact:status]'] = param.status;
    }
    if (param.operation) {
      options['filter[:exact:operation]'] = param.operation;
    }

    return options;
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
