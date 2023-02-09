import { attr } from '@ember-data/model';
import SecurityScheme from './security-scheme';

export default class Oauth2SecurityScheme extends SecurityScheme {
  @attr uri;
  @attr('string') token;
  @attr('string') flow;
}
