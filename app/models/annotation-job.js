import { attr } from '@ember-data/model';
import JobModel from './job';

export default class AnnotationJobModel extends JobModel {
  @attr codelist;
  @attr propertyPathForText;
  @attr('number') confidenceThreshold;
}
