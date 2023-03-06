import Controller from '@ember/controller';
import config from 'frontend-harvesting-self-service/config/environment';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service session;
  
  authenticationEnabled = ['true', 'True', 'TRUE', true].includes(
    config.harvester.AUTHENTICATION_ENABLED
  );
}
