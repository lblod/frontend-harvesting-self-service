import Component from '@glimmer/component';
import * as cts from '../utils/constants';

export default class OperationFilterComponent extends Component {
  jobOperations = [...cts.JOB_OP_TYPE_CREATE.keys()];
}
