import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AcmidmCallbackRoute extends Route {
  @service session;

  beforeModel() {
    this.session.prohibitAuthentication('index');
  }

  async model({ code }) {
    if (code) {
      try {
        await this.session.authenticate('authenticator:acm-idm', code);
      } catch (error) {
        throw new Error(
          'Something went wrong while authenticating the user in the backend. The token might be expired.',
          { cause: error },
        );
      }
    } else {
      throw new Error('Missing authorization token');
    }
  }
}
