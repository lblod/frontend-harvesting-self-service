import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

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
}
