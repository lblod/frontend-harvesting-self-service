import Model, { belongsTo } from '@ember-data/model';

export default class AuthenticationConfiguration extends Model {
  @belongsTo('credential') credential;
  @belongsTo('security-scheme') securityScheme;
}
