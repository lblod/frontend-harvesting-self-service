import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class JobCreatorInfoComponent extends Component {
  @service store;

  @tracked scheduledJob = null;
  @tracked isLoading = false;
  @tracked error = null;

  constructor() {
    super(...arguments);
    this.loadScheduledJobInfo();
  }

  get scheduledJobId() {
    if (!this.args.creator) {
      return null;
    }

    const scheduledJobPattern =
      /^http:\/\/redpencil\.data\.gift\/id\/scheduled-job\/(.+)$/;
    const match = this.args.creator.match(scheduledJobPattern);

    return match ? match[1] : null;
  }

  get isScheduledJob() {
    return !!this.scheduledJobId;
  }

  async loadScheduledJobInfo() {
    if (!this.isScheduledJob) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      this.scheduledJob = await this.store.findRecord(
        'scheduled-job',
        this.scheduledJobId
      );
    } catch (error) {
      this.error = error;
      console.error('Failed to load scheduled job info:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
