import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class JobTargetUrlComponent extends Component {
  @service store;
  @tracked url;

  constructor() {
    super(...arguments);
    if (this.args.job) {
      this.fetchTargetUrl.perform();
    }
  }

  @task
    *fetchTargetUrl() {
      try {
    const tasks = yield this.args.job.tasks;
    const firstTask = tasks.find(task => task.get('index') === "0");
    if (firstTask) {
      const remoteDataObject = yield this.store.query('remoteDataObject', {
        'filter[harvesting-collection][data-container][input-from-tasks][:id:]': firstTask.id
      });
      this.url = remoteDataObject.firstObject.source;
    }
      }
      catch(e) {
        console.error(e);
      }

  }
}
