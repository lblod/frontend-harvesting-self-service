import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class JobModel extends Model {
  @attr('string') uri;
  @attr('string') status;
  @attr('date') created;
  @attr('date') modified;
  @attr('string') comment;
  @attr('string') creator;
  @attr('string') operation;
  @attr('string') vendor;

  @belongsTo('job-error', { async: true, inverse: null }) error;
  @hasMany('task', { async: true, inverse: 'job' }) tasks;

  //TODO: move this later to a propery modeled skos:Conceptscheme from backend
  statusesMap = {
    'http://redpencil.data.gift/id/concept/JobStatus/busy': 'busy',
    'http://redpencil.data.gift/id/concept/JobStatus/scheduled': 'scheduled',
    'http://redpencil.data.gift/id/concept/JobStatus/success': 'success',
    'http://redpencil.data.gift/id/concept/JobStatus/failed': 'failed',
    'http://redpencil.data.gift/id/concept/JobStatus/canceled': 'canceled',
  };

  get shortStatus() {
    return this.statusesMap[this.status];
  }
}
