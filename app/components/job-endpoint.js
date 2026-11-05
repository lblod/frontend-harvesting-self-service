import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';

const SCHEDULED_JOB_BASE = 'http://redpencil.data.gift/id/scheduled-job/';

export default class JobEndpointComponent extends Component {
  @service jobEndpoint;

  @tracked endpoint = null;
  @tracked failed = false;

  constructor() {
    super(...arguments);
    this.loadEndpoint.perform();
  }

  // @job is a job or a scheduled job. A job created by a scheduled job uses the
  // scheduled job's endpoint, and its own tasks if that scheduled job is gone.
  loadEndpoint = task(async () => {
    const { creator, uri } = this.args.job;
    const scheduledJobUri = creator?.startsWith(SCHEDULED_JOB_BASE)
      ? creator
      : null;

    try {
      this.endpoint =
        (await this.jobEndpoint.lookup(scheduledJobUri)) ??
        (await this.jobEndpoint.lookup(uri));
    } catch (error) {
      this.failed = true;
      console.error('Failed to load job endpoint:', error);
    }
  });
}
