import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';
export default class HarvestIndexController extends Controller {
  @tracked page = 0;
  @tracked sort = 'created';
  @tracked size = 15;

  @task
  *deleteHarvestingTask(task){
    const collection = yield task.harvestingCollection;
    if(collection && collection.id){
      const remoteDataObjects = yield collection.remoteDataObjects;

      //Delete top level down the tree, less confusing if something fails.
      yield task.destroyRecord();
      yield collection.destroyRecord();
      for(const rObj of remoteDataObjects.toArray()){
        yield rObj.destroyRecord();
      }
    }
  }
}
