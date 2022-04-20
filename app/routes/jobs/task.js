import Route from '@ember/routing/route';

export default class JobsTaskRoute extends Route {
  model(param) {
    return this.store.findRecord('task', param.id);
  }
}
