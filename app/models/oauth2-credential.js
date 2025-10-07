import { attr } from '@ember-data/model';
import Credential from './credential';

export default class Oauth2Credential extends Credential {
  @attr uri;
  @attr clientId;
  @attr clientSecret;
}
