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
          this.fetchTargetOperation.perform();
        }
      }
    
      @task
      *fetchTargetOperation() {
        try {
          const tasks = yield this.args.job.tasks;
          const firstTask = tasks.find((task) => task.get('index') === '0');
          if (firstTask) {
            const remoteDataObject = yield this.store.query('remoteDataObject', {
              'filter[harvesting-collection][data-container][input-from-tasks][:id:]':
                firstTask.id,
              sort: 'created',
            });
    
            const thisData =
              remoteDataObject.manager._adapterPopulatedRecordArrays[0]._objects[0]
                ._internalModel.__recordData.__data,
                operation = thisData.operation

                if (operation === 'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestAndPublish') {
                    this.operation = 'Harvest & Publish';
                } else if (operation === 'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestUrl') {
                    this.operation = 'Harvest Url'
                } else {
                    this.operation = 'Publish'
                }

          }
        } catch (e) {
          console.error(e);
        }
      }
}
