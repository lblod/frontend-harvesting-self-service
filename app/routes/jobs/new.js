import Route from '@ember/routing/route';

export default class JobsNewRoute extends Route {
  setupController(controller /*, model */) {
    super.setupController(...arguments);
    controller.set('selectedJobOperation', null);
    controller.set('scheduling', false);
    controller.set('url', null);
    controller.set('comment', null);
    controller.set('graphName', null);
    controller.set('selectedSecurityScheme', null);
    controller.set('credentials', {});
    controller.set('securityScheme', {});
  }
}
