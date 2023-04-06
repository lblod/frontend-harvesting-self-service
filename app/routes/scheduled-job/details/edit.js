import Route from '@ember/routing/route';

export default class ScheduledJobDetailsEditRoute extends Route {
  async beforeModel() {
    this.job = this.modelFor('scheduled-job');
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('job', this.job);
    controller.set('newTitle', this.job.title);
    controller.set('newTitleValid', true);
    controller.set('newCronPattern', this.job.schedule?.get('repeatFrequency'));
    controller.set('newCronPatternValid', true);
  }
}
