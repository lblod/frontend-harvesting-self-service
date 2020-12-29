import Model, { hasMany }  from '@ember-data/model';

export default class DataContainerModel extends Model {
  @hasMany('file') files;
  @hasMany('harvesting-collection') harvestingCollections;
}
