import EmberRouter from '@ember/routing/router';
import config from 'frontend-harvesting-self-service/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('jobs', function() {
    this.route('create-task');
    this.route('details', { path: '/:id' }, function(){
      this.route('index');
    });
  });
});
