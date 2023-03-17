import Model, { hasMany, attr } from '@ember-data/model';

export default class DataContainerModel extends Model {
  @attr('string') uri;
  @attr('string') hasGraph;
  @hasMany('file', { async: true, inverse: 'dataContainer' }) files;
  @hasMany('harvesting-collection', { async: true, inverse: null })
  harvestingCollections;
}
