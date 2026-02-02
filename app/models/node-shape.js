import Model from '@ember-data/model';
import { attr } from '@ember-data/model';

export default class NodeShapeModel extends Model {
  @attr uri;
  @attr targetNode;
}
