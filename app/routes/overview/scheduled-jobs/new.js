import Route from '@ember/routing/route';

export default class OverviewScheduledJobsNewRoute extends Route {
  setupController(controller /*, model */) {
    super.setupController(...arguments);
    controller.set('title', null);
    controller.set('titleValid', true);
    controller.set('url', null);
    controller.set('urlValid', true);
    controller.set('selectedJobOperation', null);
    controller.set('selectedJobOperationValid', true);
    controller.set('cronPattern', '*/5 * * * *');
    controller.set('cronPatternValid', true);
    controller.set('selectedSecurityScheme', null);
    controller.set('securityScheme', {});
    controller.set('credentials', {});
  }
}
