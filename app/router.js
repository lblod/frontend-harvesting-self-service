import EmberRouter from '@ember/routing/router';
import config from 'frontend-harvesting-self-service/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('jobs', function() {
    this.route('details', { path: '/:id' }, function(){
      this.route('index');
    });
    this.route('task', { path: '/task/:id' }, function(){
      this.route('input-containers-files');
      this.route('results-containers-files');
      this.route('input-containers-graph');
      this.route('results-containers-graph');
      this.route('input-containers-harvesting-collections');
    });

    this.route('new');
  });
  this.route('scheduled-jobs', function() {});
});
