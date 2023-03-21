import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class JobTargetUrlComponent extends Component {
  @service store;
  @tracked url;

  @action
  load() {
    if (this.args.job) this.fetchTargetUrl.perform();
  }

  @task
  *fetchTargetUrl() {
    try {
      const tasks = yield this.args.job.tasks;
      const firstTask = tasks.find((task) => task.get('index') === '0');
      if (firstTask) {
        const remoteDataObject = yield this.store.query('remoteDataObject', {
          'filter[harvesting-collection][data-container][input-from-tasks][:id:]':
            firstTask.id,
          sort: 'created',
        });

        this.url = !remoteDataObject[0] ? 'N/A' : remoteDataObject[0].source;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
