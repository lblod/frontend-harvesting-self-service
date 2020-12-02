import Model, { attr, belongsTo } from '@ember-data/model';

export default class HarvestingCollectionModel extends Model {
  @attr('string') status;
  @belongsTo('remote-data-object') remoteDataObject;

  get shortStatus(){
    const split = this.status.split('/')
    return split[split.length-1]
  }
}
