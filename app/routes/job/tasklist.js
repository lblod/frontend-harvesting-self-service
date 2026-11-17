import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { JOB_STATUS_SHORT } from '../../utils/constants';

export default class JobTasklistRoute extends Route {
  @service store;

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

  async model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
      include: 'job',
      'filter[job][:id:]': this.job.id,
    };

    if (params.status) {
      options['filter[:exact:status]'] = params.status;
    }
    if (params.operation) {
      options['filter[:exact:operation]'] = params.operation;
    }

    const tasks = await this.store.query('task', options);

    const statusCounts = {};
    await Promise.all(
      Object.keys(JOB_STATUS_SHORT).map(async (status) => {
        const countedTasks = await this.store.query('task', {
          'filter[job][:id:]': this.job.id,
          'filter[status][:uri:]': status,
          page: { size: 1 },
        });
        if (countedTasks.meta.count == 0) {
          return;
        }
        statusCounts[status] = {
          status,
          count: countedTasks.meta.count,
          statusName: JOB_STATUS_SHORT[status],
        };
      }),
    );
    const statusCountList = Object.keys(JOB_STATUS_SHORT)
      .map((status) => {
        return statusCounts[status];
      })
      .filter((s) => !!s);

    return {
      tasks,
      statusCounts: statusCountList,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
  }
}
