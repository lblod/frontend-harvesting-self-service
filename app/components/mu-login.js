import BaseMuLoginComponent from 'ember-mu-login/components/mu-login';
import { action } from '@ember/object';

export default class MuLoginComponent extends BaseMuLoginComponent {
  @action
  updateNickname(event) {
    this.nickname = event.target.value;
  }

  @action
  updatePassword(event) {
    this.password = event.target.value;
  }
}
