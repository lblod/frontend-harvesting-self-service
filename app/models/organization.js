import Model, { hasMany, attr } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr identifier;
  @attr 'pref-label';
  @attr classification;

  @hasMany('sub-organization', { async: true, inverse: null }) subOrganizations;
}