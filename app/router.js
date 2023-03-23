import EmberRouter from '@ember/routing/router';
import config from 'frontend-harvesting-self-service/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

const authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
  config.harvester.authEnabled
);

Router.map(function () {
  this.route('jobs', function () {
    this.route('details', { path: '/:id' });
    this.route('task', { path: '/task/:id' }, function () {
      this.route('input-containers-files');
      this.route('results-containers-files');
      this.route('input-containers-graph');
      this.route('results-containers-graph');
      this.route('input-containers-harvesting-collections');
    });
  });
  this.route('scheduled-jobs', function () {
    this.route('details', { path: '/:id' }, function () {
      this.route('index');
    });
    this.route('scheduled-task', { path: '/scheduled-task/:id' }, function () {
      this.route('input-containers-files');
      this.route('input-containers-graph');
      this.route('input-containers-harvesting-collections');
    });

    this.route('new');
  });
  this.route('sparql');

  if (authenticationEnabled) {
    this.route('login');
  }

  this.route('overview', function () {
    this.route('jobs', function () {
      this.route('new');
    });
    this.route('scheduled-jobs');
  });
  this.route('job2', { path: '/job2/:id' }, function () {
    this.route('tasklist');
  });
});
