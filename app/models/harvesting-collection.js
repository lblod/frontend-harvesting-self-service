import Model, { attr, hasMany } from '@ember-data/model';

export default class HarvestingCollectionModel extends Model {
  @attr('string') status;
  @attr ('date') remoteDataObject;
  @hasMany('harvesting-task') harvestingTasks;
}
