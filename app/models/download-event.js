import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class DownloadEventModel extends Model {
  @attr('string') status;
  @attr('date') created;
  @attr('date') modified;
  @belongsTo('remote-data-object') remoteDataObject;
  @hasMany('files') files;

  get shortStatus(){
    const split = this.status.split('/')
    return split[split.length-1]
  }
}
