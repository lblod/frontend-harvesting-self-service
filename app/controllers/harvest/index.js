import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HarvestIndexController extends Controller {
  @tracked page = 0;
  @tracked sort = 'created';
  @tracked size = 15;

  @action
  async deleteTask(task){
    const collection = await task.harvestingCollection;
    if(collection && collection.id){
      const remoteDataObjects = await collection.remoteDataObjects;

      //Delete top level down the tree, less confusing if something fails.
      await task.destroyRecord();
      await collection.destroyRecord();
      for(const rObj of remoteDataObjects.toArray()){
        await rObj.destroyRecord();
      }
    }
    alert('deleted');
  }
}
