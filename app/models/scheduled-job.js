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
  @attr('boolean') splitDecisions;

  @hasMany('scheduled-task', {
    async: true,
    inverse: 'scheduledJob',
    as: 'scheduled-job',
  })
  scheduledTasks;
  @belongsTo('cron-schedule', { async: true, inverse: null }) schedule;

  // For codelist mapping tasks
  @attr codelist;
  @hasMany('node-shape', { async: true, inverse: null }) shapeForTargets;

  get isConsumerDeltaSyncJob() {
    return this.operation === cts.JOB_OP_TYPE_HARVESTING_OSLO_TO_ELI;
  }

  get isJobWithMultipleEndpoints() {
    return [
      cts.JOB_OP_TYPE_HARVESTING_PDF_TO_ELI,
      cts.JOB_OP_TYPE_HARVESTING_PDF_TO_ENRICHED,
    ].includes(this.operation);
  }
}
