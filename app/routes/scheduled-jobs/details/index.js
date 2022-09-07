import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class ScheduledJobsDetailsIndexRoute extends Route.extend(
  DataTableRouteMixin
) {
  modelName = 'scheduled-task';

  async beforeModel() {
    this.job = await this.modelFor('scheduled-jobs.details').id;
  }

  mergeQueryOptions(param) {
    return {
      include: 'scheduled-job',
      'filter[scheduled-job][:id:]': this.job,
      sort: param.sort,
    };
  }
}
