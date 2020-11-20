import Model, { attr, belongsTo }  from '@ember-data/model';

export default class RemoteDataObjectModel extends Model {
  @attr('string') source;
  @attr('string') status;
}
