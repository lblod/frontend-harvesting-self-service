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

          console.log('operation: ', job.operation)
            
          if (job.operation === 'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestAndPublish') {
            this.operation = 'Harvest & Publish'
          } else if (job.operation === 'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvesting') {
            this.operation = 'Harvest'
          } else if (job.operation === 'http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/healingOperation/besluiten') {
            this.operation = 'Harvested'
          } else if (job.operation === 'http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/deltaDumpFileCreation/besluiten') {  
            this.operation = 'Dumped File'
          } else {
            this.operation = 'Publish'
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
}
