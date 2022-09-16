import Route from '@ember/routing/route';

export default class ScheduledJobsNewRoute extends Route {
  setupController(controller /*, model */) {
    super.setupController(...arguments);
    controller.set('selectedJobOperation', null);
    controller.set('success', false);
    controller.set('error', false);
    controller.set('url', null);
    controller.set('title', '');
    controller.set('comment', '');
    controller.set('cronPattern', '*/5 * * * *');
  }
}
