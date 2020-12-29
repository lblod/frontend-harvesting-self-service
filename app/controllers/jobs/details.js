import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';

export default class JobsDetailsController extends Controller {
  @tracked page = 0;
  @tracked sort = 'created';
  @tracked size = 15;

  @task
  *deleteHarvestingJob(job){
    //Delete top level down the tree, less confusing if something fails.

    //NOTE: Even though inputContainers & resultsContainers have the same nested structure, I duplicated the code since I know you like the seperation more then a wrapping |for| loop
    const tasks = yield job.tasks;
    yield job.destroyRecord();

    for(let task of tasks.toArray()) {
      const iContainers = yield task.inputContainers;
      const rContainers= yield task.resultsContainers;
      yield task.destroyRecord();


      for(let input of iContainers.toArray()){
        const fileList = yield input.files;
        const collectionList = yield input.harvestingCollections;
        yield input.destroyRecord();

        for(let file of fileList.toArray()){
          //NOTE: file model gets found but cannot get physical file in backend to delete
          yield file.destroyRecord();
        }
  
        for(let collection of collectionList.toArray()){
          const rObjs = yield collection.remoteDataObjects;
          yield collection.destroyRecord();
  
          for(let rObj of rObjs.toArray()){
            yield rObj.destroyRecord();
          }
        }
      }

      for(let result of rContainers.toArray()){
        const fileList = yield result.files;
        const collectionList = yield result.harvestingCollections;
        yield result.destroyRecord();

        for(let file of fileList.toArray()){
          //NOTE: file model gets found but cannot get physical file in backend to delete
          yield file.destroyRecord();
        }
  
        for(let collection of collectionList.toArray()){
          const rObjs = yield collection.remoteDataObjects;
          yield collection.destroyRecord();

          //NOTE: Pretty sure this should get deleted after the file issue is resolved
          for(let rObj of rObjs.toArray()){
            yield rObj.destroyRecord();
          }
        }
      }
        this.transitionToRoute('jobs.index');
    }
  }
}
