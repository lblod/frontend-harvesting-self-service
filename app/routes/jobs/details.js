import Route from '@ember/routing/route';

export default class JobDetailsRoute extends Route {

  model(param){
    return this.store.findRecord('harvesting-task', param.id);
  }
}
