import Model, { attr, hasMany } from '@ember-data/model';

export default class HarvestingCollectionModel extends Model {
  @attr('string') creator
  @hasMany('remote-data-object') hasPart;
}
