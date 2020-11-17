import Application from 'frontend-harvesting-self-service/app';
import config from 'frontend-harvesting-self-service/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
