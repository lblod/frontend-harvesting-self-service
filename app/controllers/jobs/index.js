import Controller from '@ember/controller';

export default class JobsIndexController extends Controller {
  page = 0;
  sort = '-created';
  size = 15;
}
