import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class JobOperationComponent extends Component {
    @service store;
    @tracked operation;
  
    constructor() {
      super(...arguments);
      if (this.args.job) {
        this.fetchOperation.perform();
      }
    }
  
    @task
    *fetchOperation() {
      try {
        const tasks = yield this.args.job.tasks;
        const firstTask = tasks.find((task) => task.get('index') === '0');
        const job = yield this.args.job;
        if (firstTask) {

          let operation = job.operation

          if      (operation.includes('lblodHarvestAndPublish')){ this.operation = 'Harvest & Publish' } 
          else if (operation.includes('lblodHarvesting'))       { this.operation = 'Harvest' } 
          else if (operation.includes('healingOperation'))      { this.operation = 'Healing' } 
          else if (operation.includes('deltaDumpFileCreation')) { this.operation = 'Dumped File' } 
          else    { this.operation = 'Publish' }
        }
      } catch (e) {
        console.error(e);
      }
    }
}
