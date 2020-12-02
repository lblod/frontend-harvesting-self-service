import Model, { attr, belongsTo } from '@ember-data/model';

export default class HarvestingCollectionModel extends Model {
  @attr('string') creator
  @belongsTo('remote-data-object') hasPart;
}
