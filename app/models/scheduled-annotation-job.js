import { attr, hasMany } from '@ember-data/model';
import ScheduledJobModel from './scheduled-job';

export default class AnnotationJobModel extends ScheduledJobModel {
  @attr codelist;
  @hasMany('node-shape', { async: true, inverse: null }) shapeForTargets;
}
