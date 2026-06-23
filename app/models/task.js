import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { JOB_STATUS_SHORT } from '../utils/constants';

export default class TaskModel extends Model {
  @attr uri;
  @attr status;
  @attr('date') created;
  @attr('date') modified;
  @attr operation;
  @attr index;

  @belongsTo('job-error', { async: true, inverse: null }) error;
  @belongsTo('job', { async: true, inverse: 'tasks' }) job;

  @hasMany('task', { async: true, inverse: null }) parentTasks;

  //Due to lack of inheritance in mu-cl-resource, we directly link to file and collection, stuff we need here.
  @hasMany('data-container', { async: true, inverse: null }) resultsContainers;
  @hasMany('data-container', { async: true, inverse: null }) inputContainers;

  get shortStatus() {
    return JOB_STATUS_SHORT[this.status];
  }
}
