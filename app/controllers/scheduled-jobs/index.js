import Controller from '@ember/controller';

export default class ScheduledJobsIndexController extends Controller {
  page = 0;
  sort = '-created';
  size = 15;
}
