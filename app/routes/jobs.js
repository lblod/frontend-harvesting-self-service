import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import config from 'frontend-harvesting-self-service/config/environment';

export default class JobsRoute extends Route {
  @service session;

  beforeModel(transition) {
    const authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
      config.harvester.AUTHENTICATION_ENABLED
    );

    if (authenticationEnabled) {
      this.session.requireAuthentication(transition, 'login');
    }
  }
}
