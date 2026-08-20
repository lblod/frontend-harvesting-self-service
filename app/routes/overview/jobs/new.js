import Route from '@ember/routing/route';

export default class OverviewJobsNewRoute extends Route {
  setupController(controller, _model, transition) {
    super.setupController(...arguments);
    if (transition?.from?.name != transition?.to?.name) {
      controller.set('selectedJobOperation', null);
      controller.set('selectedJobOperationValid', true);
      controller.set('selectedMunicipality', null);
      controller.set('codelist', null);
      controller.set('url', null);
      controller.set('urlValid', true);
      controller.set('comment', null);
      controller.set('graphName', null);
      controller.set('graphNameValid', true);
      controller.set('vendor', null);
      controller.set('vendorValid', true);
      controller.set('selectedSecurityScheme', null);
      controller.set('credentials', {});
      controller.set('securityScheme', {});
    }
  }
}
