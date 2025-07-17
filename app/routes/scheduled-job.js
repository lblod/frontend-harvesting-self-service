import Route from '@ember/routing/route';
import { service } from '@ember/service';
import config from 'frontend-harvesting-self-service/config/environment';

export default class ScheduledJobRoute extends Route {
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
    return this.store.findRecord('scheduled-job', param.job_id, {
      include: 'schedule',
    });
  }

  redirect(model) {
    // Default to details index page when accessing /scheduled-job/:id
    this.transitionTo('scheduled-job.details.index', model.id);
  }
}
