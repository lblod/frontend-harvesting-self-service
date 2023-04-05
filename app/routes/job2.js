import Route from '@ember/routing/route';
import { service } from '@ember/service';
import config from 'frontend-harvesting-self-service/config/environment';

export default class Job2Route extends Route {
  @service store;
  @service session;

  beforeModel(transition) {
    const authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
      config.harvester.authEnabled
    );
    if (authenticationEnabled)
      this.session.requireAuthentication(transition, 'login');
  }

  model(param) {
    return this.store.findRecord('job', param.job_id);
  }
}
