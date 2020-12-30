import Model, { hasMany, attr }  from '@ember-data/model';

export default class DataContainerModel extends Model {
  @attr('string') uri;
  @hasMany('file') files;
  @hasMany('harvesting-collection') harvestingCollections;
}
