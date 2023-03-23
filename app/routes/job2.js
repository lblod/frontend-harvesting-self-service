import Route from '@ember/routing/route';
import { service } from '@ember/service';
import config from 'frontend-harvesting-self-service/config/environment';

export default class Job2Route extends Route {
  @service store;

  model(param) {
    return this.store.findRecord('job', param.jobId);
  }
}
