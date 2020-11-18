import EmberRouter from '@ember/routing/router';
import config from 'frontend-harvesting-self-service/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('harvest', function() {
    this.route('create-task');
    this.route('details');
  });
});
