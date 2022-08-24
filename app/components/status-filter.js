import Component from '@glimmer/component';

export default class StatusFilterComponent extends Component {

  statusOptions = [
    'success', 'busy', 'scheduled', 'failed', 'canceled'
  ]

}
