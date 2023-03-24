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

  if (authenticationEnabled) {
    this.route('login');
  }

  this.route('overview', function () {
    this.route('jobs', function () {
      this.route('new');
    });
    this.route('scheduled-jobs');
    this.route('sparql');
  });
  this.route('job2', { path: '/job2/:jobId' }, function () {
    this.route('tasklist');
    this.route('task', { path: '/task/:taskId' }, function () {
      this.route('input-container-files');
      this.route('results-container-files');
      this.route('input-container-graph');
      this.route('results-container-graph');
      this.route('input-container-harvesting-collections');
    });
  });
});
