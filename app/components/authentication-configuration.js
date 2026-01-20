import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class AuthenticationConfiguration extends Component {
  @action
  handleCredentialsChange(attributeName, event) {
    this.args.onCredentialsChange(attributeName, event.target.value);
  }

  @action
  handleSecuritySchemeChange(attributeName, event) {
    this.args.onSecuritySchemeChange(attributeName, event.target.value);
  }
}
