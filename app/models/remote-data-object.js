import Model, { attr, belongsTo }  from '@ember-data/model';

export default class RemoteDataObjectModel extends Model {
  @attr('string') source;
  @attr('date') created;
  @attr('date') modified;
  @attr('string') status;
  @attr('string') requestHeader;
  @attr('string') creator;
  @belongsTo('file') file;

  get downloadLink() {
    return `/files/${this.id}/download`;
  }

  get shortStatus(){
    const split = this.status.split('/')
    return split[split.length-1]
  }
}
