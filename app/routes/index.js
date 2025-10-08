import Route from '@ember/routing/route';
import { service } from '@ember/service';
import config from 'frontend-harvesting-self-service/config/environment';

export default class IndexRoute extends Route {
  @service session;
  @service router;

  beforeModel(transition) {
    const authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
      config.harvester.authEnabled,
    );
    if (authenticationEnabled) this.session.requireAuthentication(transition);
    this.router.transitionTo('overview.jobs');
  }
}
