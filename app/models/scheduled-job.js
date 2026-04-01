import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import * as cts from '../utils/constants';

export default class ScheduledJobModel extends Model {
  @attr uri;
  @attr title;
  // @attr status;
  @attr('date') created;
  @attr('date') modified;
  @attr creator;
  @attr operation;
  @attr vendor;

  @hasMany('scheduled-task', { async: true, inverse: 'scheduledJob' })
  scheduledTasks;
  @belongsTo('cron-schedule', { async: true, inverse: null }) schedule;

  get isConsumerDeltaSyncJob() {
    return this.operation === cts.JOB_OP_TYPE_HARVESTING_OSLO_TO_ELI;
  }

  get isJobWithMultipleEndpoints() {
    return this.operation === cts.JOB_OP_TYPE_PDF_SCRAPING;
  }
}
