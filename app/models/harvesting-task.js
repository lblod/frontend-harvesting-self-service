import Model, { attr, belongsTo }  from '@ember-data/model';

export default class HarvestingTaskModel extends Model {
  @attr('string') uri;
  @attr('string') status;
  @attr('date') created;
  @attr('date') modified;
  @attr('string') creator;
  @attr('string') graph; //TODO: this might need rethinking in the backend...
  @belongsTo('harvesting-collection') harvestingCollection;

  //TODO: move this later to a propery modeled skos:Conceptscheme
  statusesMap = {
    'http://lblod.data.gift/harvesting-statuses/ready-for-importing': 'ready-for-importing',
    'http://lblod.data.gift/harvesting-statuses/failed': 'failure',
    'http://lblod.data.gift/harvesting-statuses/failure': 'failure', //TODO: clean up these statuses
    'http://lblod.data.gift/harvesting-statuses/ready-for-collecting': 'ready-for-collecting',
    'http://lblod.data.gift/harvesting-statuses/importing': 'ongoing',
    'http://lblod.data.gift/harvesting-statuses/ready-for-sameas': 'ready-for-sameas', //TODO: rethink the setting in of status in backends
    'http://lblod.data.gift/harvesting-statuses/succes': 'success', //TODO: find typo in backed
    'http://lblod.data.gift/harvesting-statuses/success': 'success',
    'http://lblod.data.gift/harvesting-statuses/collected': 'collected',
    'http://lblod.data.gift/harvesting-statuses/importing-with-sameas': 'ongoing'
  };

  get shortStatus(){
    return this.statusesMap[this.status];
  }

}
