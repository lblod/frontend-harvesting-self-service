import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class JobsDetailsIndexRoute extends Route.extend(
  DataTableRouteMixin
) {
  modelName = 'task';

  async beforeModel() {
    this.job = await this.modelFor('jobs.details').id;
  }

  mergeQueryOptions(param) {
    return {
      include: 'job',
      'filter[job][:id:]': this.job,
      sort: param.sort,
    };
  }
}
