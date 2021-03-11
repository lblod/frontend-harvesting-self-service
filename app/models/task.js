import Model, { attr, belongsTo, hasMany }  from '@ember-data/model';

export default class TaskModel extends Model {
  @attr('string') uri;
  @attr('string') status;
  @attr('date') created;
  @attr('date') modified;
  @attr('string') operation;
  @attr('string') index;

  @belongsTo('job-error') error;
  @belongsTo('job') job;

  @hasMany('task') parentTasks;

  //Due to lack of inheritance in mu-cl-resource, we directly link to file and collection, stuff we need here.
  @hasMany('data-container') resultsContainers;
  @hasMany('data-container') inputContainers;

  //TODO: move this later to a propery modeled skos:Conceptscheme from backend
  statusesMap = {
    'http://redpencil.data.gift/id/concept/JobStatus/busy': 'busy',
    'http://redpencil.data.gift/id/concept/JobStatus/scheduled': 'scheduled',
    'http://redpencil.data.gift/id/concept/JobStatus/success': 'success',
    'http://redpencil.data.gift/id/concept/JobStatus/failed': 'failed',
    'http://redpencil.data.gift/id/concept/JobStatus/canceled': 'canceled'
  };

  get shortStatus(){
    return this.statusesMap[this.status];
  }
}
