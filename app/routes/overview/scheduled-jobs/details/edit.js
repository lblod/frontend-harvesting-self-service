import Route from '@ember/routing/route';

export default class OverviewScheduledJobsDetailsEditRoute extends Route {
  async model() {
    return await this.modelFor('overview.scheduled-jobs.details');
  }
  async setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('newTitle', model.title);
    controller.set('newTitleValid', true);

    // Load the schedule relationship and get the cron pattern
    const schedule = await model.schedule;
    controller.set('newCronPattern', schedule?.repeatFrequency);
    controller.set('newCronPatternValid', true);

    // Load current endpoint
    await controller.loadCurrentEndpoint.perform();
    controller.set('newEndpointValid', true);
  }
}
