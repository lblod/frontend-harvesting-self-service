import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
export default class StatusFilterComponent extends Component {

  status = [
    'success', 'busy', 'scheduled', 'failed', 'canceled'
  ]

  queryParams = ['status']
  @tracked status = null

}
