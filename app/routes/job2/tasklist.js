import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';
import { service } from '@ember/service';

export default class Job2TasklistRoute extends Route.extend(
  DataTableRouteMixin
) {
  @service store;

  modelName = 'task';

  async beforeModel() {
    this.job = await this.modelFor('job2').id;
  }

  mergeQueryOptions(param) {
    return {
      include: 'job',
      'filter[job][:id:]': this.job,
      sort: param.sort,
    };
  }
}
