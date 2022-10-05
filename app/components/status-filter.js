import Component from '@glimmer/component';
import { JOB_OP_STATUS } from 'frontend-harvesting-self-service/utils/constants';

export default class StatusFilterComponent extends Component {
  statusOptions = [...JOB_OP_STATUS.keys()];
}
