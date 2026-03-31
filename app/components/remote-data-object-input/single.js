import Component from '@glimmer/component';

import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RemoteDataObjectInputSingle extends Component {
  @service store;

  @tracked isTouched = false;

  @action
  update(event) {
    this.isTouched = true;
    const source = event.target?.value;
    let model = this.args.model;
    if (!model) {
      const now = new Date();
      model = this.store.createRecord('remote-data-object', {
        status: undefined,
        requestHeader:
          'http://data.lblod.info/request-headers/accept/text/html',
        created: now,
        modified: now,
        creator: this.args.creator,
      });
    }

    model.source = source;
    return this.args.onChange?.(model);
  }

  get label() {
    return this.args.label ?? 'URL';
  }

  get componentId() {
    return this.args.id ?? 'url';
  }

  get isError() {
    if (!this.isTouched) {
      return false;
    }
    return this.args.isError;
  }
}
