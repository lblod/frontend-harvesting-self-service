import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

/**
 * @argument taskId {string} the mu:uuid of the task
 */

export default class TaskResourceTypeSummaryComponent extends Component {
  @tracked types = [];
  @tracked totalResources = 0;
  @tracked isLoading = true;
  @tracked errored = false;

  constructor(owner, args) {
    super(owner, args);
    this.load();
  }

  async load() {
    const id = this.args.taskId;
    if (!id) {
      this.errored = true;
      this.isLoading = false;
      return;
    }
    try {
      const response = await fetch(
        `/resource-type-service/tasks/${id}/resource-types`,
        { headers: { Accept: 'application/json' } },
      );
      if (!response.ok) {
        throw new Error(`Unexpected response ${response.status}`);
      }
      const json = await response.json();
      this.types = json?.data?.attributes?.types ?? [];
      this.totalResources = json?.data?.attributes?.totalResources ?? 0;
    } catch (error) {
      console.error(
        `Failed to load resource type summary for task ${id}`,
        error,
      );
      this.errored = true;
    } finally {
      this.isLoading = false;
    }
  }
}
