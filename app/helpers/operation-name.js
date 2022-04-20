import { helper } from '@ember/component/helper';
import { JOB_OP_TYPES } from '../utils/constants';

export default helper(function operationName([uri] /*, hash*/) {
  const name = JOB_OP_TYPES.get(uri);
  return name || '';
});
