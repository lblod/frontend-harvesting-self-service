import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
export default class StatusFilterComponent extends Component {

  options = [
    'success', 'busy', 'scheduled', 'failed', 'canceled'
  ]
}
