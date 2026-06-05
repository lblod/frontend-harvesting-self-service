import Route from '@ember/routing/route';
import { service } from '@ember/service';
import config from 'frontend-harvesting-self-service/config/environment';

export default class OverviewDashboardRoute extends Route {
  @service session;

  beforeModel(transition) {
    const authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
      config.harvester.authEnabled,
    );
    if (authenticationEnabled) {
      this.session.requireAuthentication(transition);
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.loadData.perform();
  }
}
