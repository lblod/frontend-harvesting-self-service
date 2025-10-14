import SessionService from 'ember-simple-auth/services/session';
import ENV from 'frontend-harvesting-self-service/config/environment';

export default class AppSessionService extends SessionService {
  get isAcmIdmSession() {
    if (!this.isAuthenticated) {
      return false;
    }

    return this.data.authenticated.authenticator === 'authenticator:acm-idm';
  }

  // We override the requireAuthentication method since ESA doesn't provide a way to configure the default login route
  requireAuthentication(transition) {
    const loginRoute =
      ENV['harvester'].loginRoute !== '{{LOGIN_ROUTE}}'
        ? ENV['harvester'].loginRoute
        : 'login';

    return super.requireAuthentication(transition, loginRoute);
  }

  invalidate() {
    // We store the flag here since the data is cleared before the handleInvalidation method is called.
    this.wasAcmIdmSession = this.isAcmIdmSession;
    super.invalidate(...arguments);
  }

  handleInvalidation(logoutUrl) {
    if (this.wasAcmIdmSession) {
      logoutUrl = ENV.acmidm.logoutUrl;
    }

    super.handleInvalidation(logoutUrl);
  }
}
