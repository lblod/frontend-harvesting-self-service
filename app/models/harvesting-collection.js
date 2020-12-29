import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class HarvestingCollectionModel extends Model {
  @attr('string') uri;
  @attr('string') creator;
  @hasMany('remote-data-object') remoteDataObjects;
}
