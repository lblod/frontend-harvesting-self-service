import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ScheduledTaskModel extends Model {
  @attr('string') uri;
  @attr('date') created;
  @attr('date') modified;
  @attr('string') operation;
  @attr('string') index;

  @belongsTo('scheduled-job', { async: true, inverse: 'scheduledTasks' })
  scheduledJob;

  @hasMany('task', { async: true, inverse: null }) parentTasks;
  @hasMany('data-container', { async: true, inverse: null }) inputContainers;
}
