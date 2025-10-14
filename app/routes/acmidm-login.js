import Route from '@ember/routing/route';
import { service } from '@ember/service';
import buildUrlFromConfig from '@lblod/ember-acmidm-login/utils/build-url-from-config';
import ENV from 'frontend-harvesting-self-service/config/environment';

export default class AcmidmLoginRoute extends Route {
  @service session;
  @service router;

  beforeModel() {
    if (this.session.prohibitAuthentication('index')) {
      if (isValidAcmidmConfig(ENV.acmidm)) {
        // We do the transition in the `routeDidChange` event because it is the only place I've found where the browser history has been correctly updated.
        // The Route hooks run too soon, which means the previous history entry would be replaced instead.
        this.router.on('routeDidChange', () => {
          window.location.replace(buildUrlFromConfig(ENV.acmidm));
        });
      } else {
        throw new Error('Missing ACM/IDM config');
      }
    }
  }
}

function isValidAcmidmConfig(acmidmConfig) {
  return Object.values(acmidmConfig).every(
    (value) =>
      typeof value === 'string' &&
      value.trim() !== '' &&
      !value.startsWith('{{'),
  );
}
