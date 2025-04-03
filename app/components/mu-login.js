import BaseMuLoginComponent from 'ember-mu-login/components/mu-login';

export default class MuLoginComponent extends BaseMuLoginComponent {
  handleNicknameInput = (event) => {
    this.nickname = event.target.value.trim();
  };

  handlePasswordInput = (event) => {
    this.password = event.target.value.trim();
  };
}
