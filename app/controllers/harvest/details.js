import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class HarvestDetailsController extends Controller {
  @tracked page = 0;
  @tracked sort = 'created';
  @tracked size = 15;
}
