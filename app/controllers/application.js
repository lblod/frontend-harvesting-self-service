import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'frontend-harvesting-self-service/config/environment';

export default class ApplicationController extends Controller {
  @service router;
  @service session;

  @tracked breadcrumbs = [];

  authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
    config.harvester.authEnabled
  );

  constructor() {
    super(...arguments);
    this.router.on('routeDidChange', this.updateBreadcrumbs.bind(this));
  }

  updateBreadcrumbs() {
    const currentRoute = this.router.currentRouteName;
    // Define breadcrumb mappings
    const breadcrumbMap = {
      index: [{ title: 'Overview', route: 'index' }],

      // Overview routes
      'overview.jobs.index': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
      ],
      'overview.jobs.new': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
        { title: 'New Job' },
      ],
      'overview.scheduled-jobs.index': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
      ],
      'overview.scheduled-jobs.new': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
        { title: 'New Scheduled Job' },
      ],
      'overview.sparql': [
        { title: 'Overview', route: 'index' },
        { title: 'Sparql' },
      ],

      // Job routes
      'job.tasklist': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
        { title: 'Details' },
      ],
      'job.task.input-container-files': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
        { title: 'Details', route: 'job.tasklist' },
        { title: 'Input Container Files' },
      ],
      'job.task.input-container-graph': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
        { title: 'Details', route: 'job.tasklist' },
        { title: 'Input Container Graphs' },
      ],
      'job.task.input-container-harvesting-collections': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
        { title: 'Details', route: 'job.tasklist' },
        { title: 'Input Container Harvesting Collections' },
      ],
      'job.task.results-container-files': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
        { title: 'Details', route: 'job.tasklist' },
        { title: 'Result Container Files' },
      ],
      'job.task.results-container-graph': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
        { title: 'Details', route: 'job.tasklist' },
        { title: 'Result Container Graphs' },
      ],

      // Scheduled job routes
      'scheduled-job.details.index': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
        { title: 'Scheduled Job Details' },
      ],
      'scheduled-job.details.edit': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
        {
          title: 'Scheduled Job Details',
          route: 'scheduled-job.details.index',
        },
        { title: 'Edit' },
      ],
      'scheduled-job.details.executions': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
        { title: 'Scheduled Job Executions' },
      ],
      'scheduled-job.scheduled-task.input-container-files': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
        {
          title: 'Scheduled Job Details',
          route: 'scheduled-job.details.index',
        },
        { title: 'Input Container Files' },
      ],
      'scheduled-job.scheduled-task.input-container-graph': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
        {
          title: 'Scheduled Job Details',
          route: 'scheduled-job.details.index',
        },
        { title: 'Input Container Graph' },
      ],
      'scheduled-job.scheduled-task.input-container-harvesting-collections': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
        {
          title: 'Scheduled Job Details',
          route: 'scheduled-job.details.index',
        },
        { title: 'Input Container Harvesting Collection' },
      ],

      // Login route
      login: [{ title: 'Login' }],
    };

    this.breadcrumbs = breadcrumbMap[currentRoute] || [
      { title: 'Overview', route: 'index' },
    ];
  }
}
