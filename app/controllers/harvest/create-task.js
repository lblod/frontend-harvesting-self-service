import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HarvestCreateTaskController extends Controller {
  @tracked creator = "http://lblod.data.gift/services/harvesting-self-service";
  @tracked status = "http://lblod.data.gift/harvesting-statuses/ready-for-collecting";
  @tracked success = false

  get currentTime() {
    let timestamp = new Date();
    return timestamp
  };

  @action createTask(){
    let task = this.store.createRecord('harvesting-task', {
      created: this.currentTime,
      modified: this.currentTime,
      status: this.status,
      creator: this.creator,
    });

    task.save().then( ()=> {
      this.success = true
    })
  }
}
