import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | harvest/create-task', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:harvest/create-task');
    assert.ok(route);
  });
});
