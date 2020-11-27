import Model, { attr }  from '@ember-data/model';

export default class RemoteDataObjectModel extends Model {
  @attr('string') source;
  @attr('date') created;
  @attr('date') modified;
  @attr('string') status;
  @attr('string') requestHeader;
  @attr('string') creator;
}
