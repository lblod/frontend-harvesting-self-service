import { attr } from '@ember-data/model';
import Credential from './credential';

export default class BasicAuthenticationCredential extends Credential {
  @attr('string') username;
  @attr('string') password;
}
