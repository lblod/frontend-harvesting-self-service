import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class HarvestCreateTaskController extends Controller {
  @tracked creator = 'http://lblod.data.gift/services/harvesting-self-service';
  @tracked status = 'http://lblod.data.gift/harvesting-statuses/ready-for-collecting';
  @tracked url;
  @tracked success = false;
  @tracked error = false;
  @tracked errorMessage;

  get currentTime() {
    const timestamp = new Date();
    return timestamp;
  }

  @action 
  async createTask(){
    const remoteDataObject = this.store.createRecord('remote-data-object', {
      source: this.url,
      status: 'http://lblod.data.gift/file-download-statuses/ready-to-be-cached',
      requestHeader: 'http://data.lblod.info/request-headers/accept/text/html',
      created: this.currentTime,
      modified: this.currentTime,
      creator: this.creator
    });

    const collection = this.store.createRecord('harvesting-collection', {
      creator: this.creator,
      remoteDataObjects: [remoteDataObject]
    });

    const task = this.store.createRecord('harvesting-task', {
      creator: this.creator,
      status: this.status,
      created: this.currentTime,
      modified: this.currentTime,
      harvestingCollection: collection,
      graph: 'http://mu.semte.ch/graphs/harvesting'
    });

    try{
      await remoteDataObject.save();
      await collection.save();
      await task.save();
      this.error = false;
      this.success = true;

    }catch(err){
      this.errorMessage = err;
      this.success = false;
      this.error = true;
    }
  }
}
