import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class JobTaskController extends Controller {
  get canRestartTask() {
    return ['failed', 'success', 'cancelled'].includes(
      this.model.task.shortStatus,
    );
  }
  @action
  restartTask() {
    this.model.task.status =
      'http://redpencil.data.gift/id/concept/JobStatus/scheduled';
    this.model.task.modified = new Date();
    this.model.task.save();
  }
}
