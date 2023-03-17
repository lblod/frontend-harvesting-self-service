import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class ScheduledJobsDetailsRoute extends Route {
  @service store;

  model(param) {
    return this.store.findRecord('scheduled-job', param.id, {
      include: 'schedule',
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.set('newTitle', model.title);
    controller.set('newComment', model.comment);
    controller.set('newCronPattern', model.schedule.get('repeatFrequency'));
  }
}
