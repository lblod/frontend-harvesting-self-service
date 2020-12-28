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
    const tasks = yield job.tasks
    yield job.destroyRecord()

    for(let task of tasks.toArray()) {
      const input = yield task.inputContainers
      const results = yield task.resultsContainers
      yield task.destroyRecord()

      for(let file of results.toArray()){
        yield file.destroyRecord()
      }

      for(let collection of input.toArray()){
        const rObjs = yield collection.remoteDataObjects
        yield collection.destroyRecord()

        for(let rObj of rObjs.toArray()){
          yield rObj.destroyRecord()
        }
      }
        this.transitionToRoute('jobs.index');

    }
  }

}
