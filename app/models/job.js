import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { JOB_STATUS_SHORT } from '../utils/constants';

export default class JobModel extends Model {
  @attr uri;
  @attr status;
  @attr('date') created;
  @attr('date') modified;
  @attr comment;
  @attr subject;
  @attr creator;
  @attr operation;
  @attr vendor;
  @attr('boolean') splitDecisions;

  @belongsTo('job-error', { async: true, inverse: null }) error;
  @hasMany('task', { async: true, inverse: 'job', as: 'job' }) tasks;

  get shortStatus() {
    return JOB_STATUS_SHORT[this.status];
  }
}
