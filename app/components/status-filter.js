import Component from '@glimmer/component';

export default class StatusFilterComponent extends Component {
  statusOptions = ['Success', 'Busy', 'Scheduled', 'Failed', 'Canceled'];
}
