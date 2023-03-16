import Route from '@ember/routing/route';

export default class ScheduledJobsNewRoute extends Route {
  setupController(controller /*, model */) {
    super.setupController(...arguments);
    controller.set('selectedJobOperation', null);
    controller.set('scheduling', false);
    controller.set('url', null);
    controller.set('title', '');
    controller.set('comment', '');
    controller.set('cronPattern', '*/5 * * * *');
    controller.set('selectedSecurityScheme', null);
    controller.set('credentials', {});
    controller.set('securityScheme', {});
  }
}
