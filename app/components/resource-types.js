import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

/**
 * Fetches and renders the rdf:type(s) of the resources a data container points
 * to via task:hasResource, together with a per-type count.
 *
 * @argument dataContainerId {string} the mu:uuid of the data container
 */
export default class ResourceTypesComponent extends Component {
  @tracked types = [];
  @tracked isLoading = true;
  @tracked errored = false;

  constructor(owner, args) {
    super(owner, args);
    this.load();
  }

  async load() {
    const id = this.args.dataContainerId;
    if (!id) {
      this.errored = true;
      this.isLoading = false;
      return;
    }
    try {
      const response = await fetch(
        `/resource-type-service/data-containers/${id}/resource-types`,
        { headers: { Accept: 'application/json' } },
      );
      if (!response.ok) {
        throw new Error(`Unexpected response ${response.status}`);
      }
      const json = await response.json();
      this.types = json?.data?.attributes?.types ?? [];
    } catch (error) {
      console.error(
        `Failed to load resource types for data container ${id}`,
        error,
      );
      this.errored = true;
    } finally {
      this.isLoading = false;
    }
  }
}
