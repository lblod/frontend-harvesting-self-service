import Route from '@ember/routing/route';

export default class JobsNewRoute extends Route {
  setupController(controller /*, model */) {
    super.setupController(...arguments);
    controller.set('selectedJobOperation', null);
    controller.set('success', false);
    controller.set('error', false);
    controller.set('url', null);
    controller.set('graphName', null);
  }
}
