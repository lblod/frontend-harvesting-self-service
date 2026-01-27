import config from 'frontend-harvesting-self-service/config/environment';

export const JOB_OP_TYPE_HARVEST =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvesting';
export const JOB_OP_TYPE_PUBLISH =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/publishHarvestedTriples';
export const JOB_OP_TYPE_IMPORT =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodImportCentraleVindplaats';
export const JOB_OP_TYPE_HARVEST_AND_IMPORT =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestAndPublish';
export const JOB_OP_TYPE_HARVEST_WORSHIP =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestWorship';
export const JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestWorshipAndPublish';
export const JOB_OP_TYPE_HARVEST_IMPORT_CP =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestAndImportCentraleVindplaats';
export const JOB_OP_TYPE_HEALING_BESLUITEN =
  'http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/healingOperation/besluiten';
export const JOB_OP_TYPE_DUMPED_BESLUITEN =
  'http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/deltaDumpFileCreation/besluiten';
export const JOB_OP_TYPE_HEALING_WORSHIP =
  'http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/healingOperation/worship';
export const JOB_OP_TYPE_DUMPED_WORSHIP =
  'http://redpencil.data.gift/id/jobs/concept/JobOperation/deltas/deltaDumpFileCreation/worship';
export const JOB_OP_TYPE_HARVESTING_OPARL =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/harvesting/oparl';
export const JOB_OP_TYPE_HARVESTING_PDF_TO_ELI =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/harvesting/pdf-to-eli';
export const JOB_OP_TYPE_NER_AND_NEL_ANNOTATIONS = 
  'http://lblod.data.gift/id/jobs/concept/JobOperation/ner-and-nel-annotations';
export const JOB_OP_TYPE_ELI_ENTITY_LINKING_TEST =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/eli-entity-linking-test';
export const JOB_OP_TYPE_CODELIST_MAPPING =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/match-codelist';
// Auth Type
export const BASIC_AUTH = {
  label: 'Basic',
  uri: 'https://www.w3.org/2019/wot/security#BasicSecurityScheme',
};
export const OAUTH2 = {
  label: 'Oauth2',
  uri: 'https://www.w3.org/2019/wot/security#OAuth2SecurityScheme',
};

export const JOB_OP_TYPES = new Map();
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVEST, 'Harvest URL');
JOB_OP_TYPES.set(JOB_OP_TYPE_PUBLISH, 'Publish');
JOB_OP_TYPES.set(JOB_OP_TYPE_IMPORT, 'Import');
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVEST_AND_IMPORT, 'Harvest & Publish');
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVEST_IMPORT_CP, 'Harvest & Import');
JOB_OP_TYPES.set(JOB_OP_TYPE_HEALING_BESLUITEN, 'Healing besluiten');
JOB_OP_TYPES.set(JOB_OP_TYPE_DUMPED_BESLUITEN, 'Dump File besluiten');
JOB_OP_TYPES.set(JOB_OP_TYPE_HEALING_WORSHIP, 'Healing worship');
JOB_OP_TYPES.set(JOB_OP_TYPE_DUMPED_WORSHIP, 'Dump File worship');
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVEST_AND_IMPORT, 'Harvest & Publish');
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVEST_WORSHIP, 'Harvest Worship');
JOB_OP_TYPES.set(
  JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT,
  'Harvest Worship & Publish',
);
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVESTING_OPARL, 'Harvest OParl API & Publish');
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVESTING_PDF_TO_ELI, 'Harvest PDF to ELI');
JOB_OP_TYPES.set(
  JOB_OP_TYPE_NER_AND_NEL_ANNOTATIONS,
  'Generate NER and NEL Annotations on ELI decisions',
);
JOB_OP_TYPES.set(JOB_OP_TYPE_ELI_ENTITY_LINKING_TEST, 'Entity Linking test');
JOB_OP_TYPES.set(JOB_OP_TYPE_CODELIST_MAPPING, 'Codelist mapping');
export const JOB_OP_TYPE_CREATE = new Map();

if (
  ['true', 'True', 'TRUE', true].includes(config.harvester.besluitenHarvesting)
) {
  JOB_OP_TYPE_CREATE.set(JOB_OP_TYPE_HARVEST, 'Harvest URL');
  JOB_OP_TYPE_CREATE.set(JOB_OP_TYPE_IMPORT, 'Import');
  JOB_OP_TYPE_CREATE.set(JOB_OP_TYPE_HARVEST_AND_IMPORT, 'Harvest & Publish');
}
if (
  ['true', 'True', 'TRUE', true].includes(config.harvester.worshipHarvesting)
) {
  JOB_OP_TYPE_CREATE.set(JOB_OP_TYPE_HARVEST_WORSHIP, 'Harvest Worship');
  JOB_OP_TYPE_CREATE.set(
    JOB_OP_TYPE_HARVEST_WORSHIP_AND_IMPORT,
    'Harvest Worship & Publish',
  );
}
if (['true', 'True', 'TRUE', true].includes(config.harvester.oparlHarvesting)) {
  JOB_OP_TYPE_CREATE.set(
    JOB_OP_TYPE_HARVESTING_OPARL,
    'Harvest OParl API & Publish as ELI',
  );
}
if (['true', 'True', 'TRUE', true].includes(config.harvester.pdfHarvesting)) {
  JOB_OP_TYPE_CREATE.set(
    JOB_OP_TYPE_HARVESTING_PDF_TO_ELI,
    'Harvest PDF & Publish as ELI',
  );
}
if (
  ['true', 'True', 'TRUE', true].includes(config.harvester.NERAndNELAnnotations)
) {
  JOB_OP_TYPE_CREATE.set(
    JOB_OP_TYPE_NER_AND_NEL_ANNOTATIONS,
    'Perform Named Entity Recognition & Entity Linking on ELI decisions & Publish',
  );
}
if (
  ['true', 'True', 'TRUE', true].includes(config.harvester.besluitenLinking)
) {
  JOB_OP_TYPE_CREATE.set(
    JOB_OP_TYPE_ELI_ENTITY_LINKING_TEST,
    'Entity Linking test',
  );
}
if (['true', 'True', 'TRUE', true].includes(config.harvester.codelistMapping)) {
  JOB_OP_TYPE_CREATE.set(JOB_OP_TYPE_CODELIST_MAPPING, 'Codelist mapping');
}

export const JOB_OP_STATUS_SUCCESS =
  'http://redpencil.data.gift/id/concept/JobStatus/success';
export const JOB_OP_STATUS_SCHEDULED =
  'http://redpencil.data.gift/id/concept/JobStatus/scheduled';
export const JOB_OP_STATUS_BUSY =
  'http://redpencil.data.gift/id/concept/JobStatus/busy';
export const JOB_OP_STATUS_FAILED =
  'http://redpencil.data.gift/id/concept/JobStatus/failed';
export const JOB_OP_STATUS_CANCELED =
  'http://redpencil.data.gift/id/concept/JobStatus/canceled';
export const JOB_OP_STATUS = new Map();
JOB_OP_STATUS.set(JOB_OP_STATUS_SUCCESS, 'Success');
JOB_OP_STATUS.set(JOB_OP_STATUS_SCHEDULED, 'Scheduled');
JOB_OP_STATUS.set(JOB_OP_STATUS_BUSY, 'Busy');
JOB_OP_STATUS.set(JOB_OP_STATUS_FAILED, 'Failed');
JOB_OP_STATUS.set(JOB_OP_STATUS_CANCELED, 'Canceled');

export const JOB_CREATOR_SELF_SERVICE =
  'http://lblod.data.gift/services/job-self-service';
