import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

export default class ScheduledJobEndpointComponent extends Component {
  @service store;

  @tracked endpoint = null;

  constructor() {
    super(...arguments);
    this.loadEndpoint.perform();
  }

  loadEndpoint = task(async () => {
    if (!this.args.scheduledJob) {
      return;
    }

    try {
      const scheduledTasks = await this.args.scheduledJob.scheduledTasks;

      if (scheduledTasks.length > 0) {
        const firstTask = scheduledTasks[0];
        const inputContainers = await firstTask.inputContainers;

        if (inputContainers.length > 0) {
          const firstContainer = inputContainers[0];
          const harvestingCollections =
            await firstContainer.harvestingCollections;

          if (harvestingCollections.length > 0) {
            const firstCollection = harvestingCollections[0];
            const remoteDataObjects = await firstCollection.remoteDataObjects;

            if (remoteDataObjects.length > 0) {
              const firstRemoteDataObject = remoteDataObjects[0];
              this.endpoint = firstRemoteDataObject.source;
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load scheduled job endpoint:', error);
    }
  });
}
