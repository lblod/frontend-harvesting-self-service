import Model, { attr } from '@ember-data/model';

export default class JobErrorModel extends Model {
  @attr uri;
  @attr message;
}
