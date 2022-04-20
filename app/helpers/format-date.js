import { helper } from '@ember/component/helper';
import { format } from 'date-fns';

export default helper(function formatDate([datetime, dateFormat] /*, hash*/) {
  if (!(datetime instanceof Date)) return '';
  if (!dateFormat) {
    dateFormat = 'dd/MM/yyyy HH:mm:ss';
  }
  return format(datetime, dateFormat);
});
