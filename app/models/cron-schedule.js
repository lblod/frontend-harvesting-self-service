import Model, { attr } from '@ember-data/model';

export default class CronScheduleModel extends Model {
  @attr repeatFrequency;
  @attr uri;
}
