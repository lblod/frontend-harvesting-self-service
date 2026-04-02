import { attr, hasMany } from '@ember-data/model';
import ScheduledJobModel from './scheduled-job';

export default class AnnotationJobModel extends ScheduledJobModel {
  @attr codelist;
  @attr graphForTargets;
  @attr propertyPathForText;
  @attr('number') confidenceThreshold;
  @hasMany('node-shape', { async: true, inverse: null }) shapeForTargets;
}
