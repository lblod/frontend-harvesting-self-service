import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class DecisionSelectorConfigurationComponent extends Component {
  @service store;

  constructor() {
    super(...arguments);
  }
}
