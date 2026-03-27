import Component from '@glimmer/component';

import { A } from '@ember/array';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { v4 as uuid } from 'uuid';

export default class UrlMultiple extends Component {
  @tracked url;
  @tracked otherUrls = A([]);

  @action
  updateUrl(urlValue) {
    this.url = urlValue;
    this.args.onChange?.(this.allUrls);
  }

  @action
  updateOtherUrl(urlObject, newUrlValue) {
    const selectedObjectIndex = this.otherUrls.indexOf(urlObject);
    const newUrlObject = {
      id: urlObject.id,
      value: newUrlValue,
    };
    this.otherUrls.replace(selectedObjectIndex, 1, [newUrlObject]);
    this.args.onChange?.(this.allUrls);
  }

  @action
  removeUrlObject(urlObject) {
    this.otherUrls.removeObject(urlObject);
    this.args.onChange?.(this.allUrls);
  }

  @action
  addEmptyUrl() {
    const newUrlObject = {
      id: `${this.args.id}-${uuid()}`,
      value: null,
    };
    this.otherUrls.pushObject(newUrlObject);
  }

  get allUrls() {
    const othersAsValues = this.otherUrls.map((urlObject) => urlObject.value);

    return [this.url, ...othersAsValues].filter((url) => url);
  }
}
