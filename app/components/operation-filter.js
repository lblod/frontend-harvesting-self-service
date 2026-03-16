import Component from '@glimmer/component';
import * as cts from '../utils/constants';

export default class OperationFilterComponent extends Component {
  /*jobOperations = Array.from(cts.JOB_OP_TYPE_CREATE).map(
    ([key, value]) => {
      return key;//{ label: value, uri: key };
    },
  );*/

  jobOperations = [...cts.JOB_OP_TYPE_CREATE.keys()];


}
