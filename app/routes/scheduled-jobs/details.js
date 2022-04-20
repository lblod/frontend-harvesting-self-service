import Route from '@ember/routing/route';

export default class ScheduledJobsDetailsRoute extends Route {
  model(param) {
    return this.store.findRecord('scheduled-job', param.id, {
      include: 'schedule',
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('newTitle', model.title);
    controller.set('newCronPattern', model.schedule.get('repeatFrequency'));
  }
}
