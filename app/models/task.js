import Model, { attr, belongsTo, hasMany }  from '@ember-data/model';

export default class TaskModel extends Model {
  @attr('string') uri;
  @attr('string') status;
  @attr('date') created;
  @attr('date') modified;
  @attr('string') taskType;
  @attr('string') index;

  @belongsTo('job-error') error;
  @belongsTo('job') job;

  @hasMany('task') parentTasks;
  @hasMany('file') resultsContainers;
  @hasMany('harvesting-collection') inputContainers;

  //TODO: move this later to a propery modeled skos:Conceptscheme from backend
  statusesMap = {
    'http://lblod.data.gift/id/lblodJob/concept/JobStatus/busy': 'busy',
    'http://lblod.data.gift/id/lblodJob/concept/JobStatus/scheduled': 'scheduled',
    'http://lblod.data.gift/id/lblodJob/concept/JobStatus/success': 'success',
    'http://lblod.data.gift/id/lblodJob/concept/JobStatus/failed': 'failed'
  };

  get shortStatus(){
    return this.statusesMap[this.status];
  };
}
