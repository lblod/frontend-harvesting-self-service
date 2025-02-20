import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SearchBarComponent extends Component {
  @service router;
  @tracked search = this.args.search || null;
  queryParams = ['page', 'sort', 'size', 'search'];

  @action
  handleSearch(event) {
    this.search = event.target.value.trimStart();
  }

  @action handleKeyUp(event) {
    if (event.code === 'Enter') {
      this.updateSearchQuery();
    }
  }
  @action
  updateSearchQuery() {
    let queryParams = { search: this.search };
    this.router.transitionTo({ queryParams });
  }
}
