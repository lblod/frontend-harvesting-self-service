import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | harvest/create-task', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:harvest/create-task');
    assert.ok(controller);
  });
});
