export const JOB_OP_TYPE_HARVEST =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvesting';
export const JOB_OP_TYPE_IMPORT =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/publishHarvestedTriples';
export const JOB_OP_TYPE_HARVEST_AND_IMPORT =
  'http://lblod.data.gift/id/jobs/concept/JobOperation/lblodHarvestAndPublish';
export const JOB_OP_TYPES = new Map();
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVEST, 'Harvest URL');
JOB_OP_TYPES.set(JOB_OP_TYPE_IMPORT, 'Publish');
JOB_OP_TYPES.set(JOB_OP_TYPE_HARVEST_AND_IMPORT, 'Harvest & Publish');
export const JOB_CREATOR_SELF_SERVICE =
  'http://lblod.data.gift/services/job-self-service';
