import Model, { hasMany, attr } from '@ember-data/model';

export default class DataContainerModel extends Model {
  @attr uri;
  @attr hasGraph;
  @hasMany('file', { async: true, inverse: 'dataContainer' }) files;
  @hasMany('harvesting-collection', { async: true, inverse: null })
  harvestingCollections;
}
