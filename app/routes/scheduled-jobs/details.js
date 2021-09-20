import Route from '@ember/routing/route';

export default class ScheduledJobsDetailsRoute extends Route {

  model(param){
    return this.store.findRecord('scheduled-job', param.id);
  }
}
