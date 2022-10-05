import Component from '@glimmer/component';

export default class StatusFilterComponent extends Component {
  
  statusOptions = [
    'http://redpencil.data.gift/id/concept/JobStatus/success', 
    'http://redpencil.data.gift/id/concept/JobStatus/busy', 
    'http://redpencil.data.gift/id/concept/JobStatus/scheduled', 
    'http://redpencil.data.gift/id/concept/JobStatus/failed', 
    'http://redpencil.data.gift/id/concept/JobStatus/canceled'
  ];
  
}