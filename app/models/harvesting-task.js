import Model, { attr, belongsTo }  from '@ember-data/model';

export default class HarvestingTaskModel extends Model {
    @attr('string') status;
    @attr('date') created;
    @attr('date') modified;
    @attr('string') creator;
    @belongsTo('harvesting-collection') harvestingCollection;

    get shortStatus(){
      const split = this.status.split('/')
      return split[split.length-1]
    }
} 
