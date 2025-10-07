import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class HarvestingCollectionModel extends Model {
  @attr uri;
  @attr creator;
  @hasMany('remote-data-object', { async: true, inverse: null })
  remoteDataObjects;
  @belongsTo('authentication-configuration', { async: true, inverse: null })
  authenticationConfiguration;
}
