import EmberRouter from '@ember/routing/router';
import config from 'frontend-harvesting-self-service/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

const authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
  config.harvester.authEnabled,
);

Router.map(function () {
  if (authenticationEnabled) {
    this.route('login');
    this.route('acmidm-login');
    this.route('acmidm-callback', { path: '/authorization/callback' });
  }
  this.route('overview', function () {
    this.route('jobs', function () {
      this.route('new');
    });
    this.route('scheduled-jobs', function () {
      this.route('new');
      this.route('details', { path: '/:job_id' }, function () {
        this.route('executions');
        this.route('edit');
      });
    });
    this.route('sparql');
  });
  this.route('job', { path: '/job/:job_id' }, function () {
    this.route('tasklist');
    this.route('task', { path: '/task/:task_id' }, function () {
      this.route('input-container-files');
      this.route('results-container-files');
      this.route('input-container-graph');
      this.route('results-container-graph');
      this.route('input-container-harvesting-collections');
    });
  });
});
