import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class AuthenticationConfiguration extends Component {
  @action
  handleCredentialsChange(attributeName, value) {
    this.args.onCredentialsChange(attributeName, value);
  }

  @action
  handleSecuritySchemeChange(attributeName, value) {
    this.args.onSecuritySchemeChange(attributeName, value);
  }
}
