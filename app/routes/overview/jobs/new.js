import Route from '@ember/routing/route';

export default class OverviewJobsNewRoute extends Route {
  setupController(controller /*, model */) {
    super.setupController(...arguments);
    controller.set('selectedJobOperation', null);
    controller.set('selectedJobOperationValid', true);
    controller.set('url', null);
    controller.set('urlValid', true);
    controller.set('comment', null);
    controller.set('graphName', null);
    controller.set('graphNameValid', true);
    controller.set('selectedSecurityScheme', null);
    controller.set('credentials', {});
    controller.set('securityScheme', {});
  }
}
