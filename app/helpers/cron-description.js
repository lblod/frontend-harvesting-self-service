import { helper } from '@ember/component/helper';
import cronstrue from 'cronstrue';

export default helper(function cronDescription([cron] /*, hash*/) {
  if (!cron) return null;
  try {
    return cronstrue.toString(cron, { use24HourTimeFormat: true });
  } catch {
    return cron;
  }
});
