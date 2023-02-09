import Model, { attr, belongsTo } from '@ember-data/model';

export default class AuthenticationConfiguration extends Model {
  @attr uri;
  @belongsTo('credential') credential;
  @belongsTo('security-scheme') securityScheme;
}
