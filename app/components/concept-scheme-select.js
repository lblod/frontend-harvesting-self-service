import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ConceptSchemeSelect extends Component {
  @service
  store;

  get conceptSchemes() {
    return this.store.query('concept-scheme', {
      filter: {
        ['show-in-hvt']: true,
      },
      page: {
        size: 999,
      },
    });
  }

  @action
  onSelect(item) {
    this.args.onChange(item);
  }
}
