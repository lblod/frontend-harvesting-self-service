import { attr, hasMany } from '@ember-data/model';
import JobModel from './job';

export default class AnnotationJobModel extends JobModel {
  @attr codelist;
  @hasMany('node-shape', { async: true, inverse: null }) shapeForTargets;
  @attr graphForTargets;
  @attr propertyPathForText;
  @attr('number') confidenceThreshold;
}
