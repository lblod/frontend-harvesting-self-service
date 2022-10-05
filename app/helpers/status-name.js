import { helper } from '@ember/component/helper';
import { JOB_OP_STATUS } from '../utils/constants';

export default helper(function statusName([uri] /*, hash*/) {
  const name = JOB_OP_STATUS.get(uri);
  return name || '';
});
