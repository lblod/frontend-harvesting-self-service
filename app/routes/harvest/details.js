import Route from '@ember/routing/route';

export default class HarvestDetailsRoute extends Route {

  model(param){
    return this.store.findRecord('harvesting-task', param.id , {include: "harvesting-collection"})
  }
}
