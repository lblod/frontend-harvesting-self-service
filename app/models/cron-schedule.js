import Model, { attr } from '@ember-data/model';

export default class CronScheduleModel extends Model {
  @attr('string') repeatFrequency;
}
