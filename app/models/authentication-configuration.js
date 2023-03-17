import Model, { attr, belongsTo } from '@ember-data/model';

export default class AuthenticationConfiguration extends Model {
  @attr uri;
  @belongsTo('credential', { async: true, inverse: null }) credential;
  @belongsTo('security-scheme', { async: true, inverse: null }) securityScheme;
}
