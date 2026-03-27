import Component from '@glimmer/component';

import { action } from '@ember/object';

export default class UrlSingle extends Component {
  @action
  updateValue(event) {
    return this.args.onChange?.(event.target?.value);
  }

  get label() {
    return this.args.label ?? 'URL';
  }

  get componentId() {
    return this.args.id ?? 'url';
  }

  get isError() {
    if (!this.args.forceErrors) {
      return false;
    }

    if (this.args.isRequired && this.isEmpty) {
      return true;
    }

    return this.isEmpty || !this.isUrl;
  }

  get isEmpty() {
    return !this.args.value;
  }

  get isUrl() {
    const urlRegex =
      /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?$/;
    return String(this.args.value).match(urlRegex) !== null;
  }
}
