import JSONAPISerializer from '@ember-data/serializer/json-api';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

export default class ApplicationSerializer extends JSONAPISerializer.extend(
  DataTableSerializerMixin
) {
  attrs = {
    uri: { serialize: false },
  };
}
