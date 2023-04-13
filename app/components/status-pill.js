import Component from '@glimmer/component';

export default class StatusPillComponent extends Component {
  get skin() {
    switch (this.args.status) {
      case 'success':
      case 'collected':
        return 'success';
      case 'failure':
      case 'failed':
      case 'canceled':
        return 'error';
      case 'ongoing':
      case 'ready-for-collecting':
      case 'ready-to-be-cached':
      case 'ready-for-sameas':
        return 'action';
      case 'busy':
        return 'warning';
      case 'scheduled':
        return 'border';
      case 'not-started':
      default:
        return 'default';
    }
  }
}
