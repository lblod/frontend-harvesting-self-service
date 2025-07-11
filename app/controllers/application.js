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
      'job.details': [
        { title: 'Overview', route: 'index' },
        { title: 'Jobs', route: 'overview.jobs' },
        { title: 'Job Details' },
      ],
      'scheduled-job.details': [
        { title: 'Overview', route: 'index' },
        { title: 'Scheduled Jobs', route: 'overview.scheduled-jobs' },
        { title: 'Scheduled Job Details' },
      ],
    };

    this.breadcrumbs = breadcrumbMap[currentRoute] || [
      { title: 'Overview', route: 'index' },
    ];
  }
}
