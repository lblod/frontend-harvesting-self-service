import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ScheduledJobModel extends Model {
  @attr('string') uri;
  @attr('string') title;
  // @attr('string') status;
  @attr('date') created;
  @attr('date') modified;
  @attr('string') creator;
  @attr('string') operation;

  @hasMany('scheduled-task', { async: true, inverse: 'scheduledJob' })
  scheduledTasks;
  @belongsTo('cron-schedule', { async: true, inverse: null }) schedule;
}
