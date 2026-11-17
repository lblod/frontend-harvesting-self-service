import { helper } from '@ember/component/helper';
import config from 'frontend-harvesting-self-service/config/environment';

export default helper(function resourceTypesEnabled() {
  return ['true', 'True', 'TRUE', true].includes(
    config.harvester.resourceTypes,
  );
});
