import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ScheduledJob2Route extends Route {
  @service store;

  model(param) {
    return this.store.findRecord('scheduled-job', param.job_id, {
      include: 'schedule',
    });
  }
}
