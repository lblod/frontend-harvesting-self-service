import Model, { hasMany, attr } from '@ember-data/model';

export default class OrganizationModel extends Model {
  @attr uri;
  @attr('string') identifier;
  @attr('string') 'pref-label';
  @attr('string') classification;

  @hasMany('has-sub-organization', { async: true, inverse: null })
  hasSubOrganization;

  @hasMany('sub-organization-of', { async: true, inverse: null })
  subOrganizationOf;

  get label() {
    return this['pref-label'];
  }
}