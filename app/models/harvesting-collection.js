import Model, { attr, belongsTo } from '@ember-data/model';

export default class HarvestingCollectionModel extends Model {
  @belongsTo('remote-data-object') remoteDataObject;
}
