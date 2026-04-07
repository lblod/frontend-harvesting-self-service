import { module, test } from 'qunit';
import { setupRenderingTest } from 'frontend-harvesting-self-service/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | decision-selector-configuration',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<DecisionSelectorConfiguration />`);

      assert.dom().hasText('');

      // Template block usage:
      await render(hbs`
      <DecisionSelectorConfiguration>
        template block text
      </DecisionSelectorConfiguration>
    `);

      assert.dom().hasText('template block text');
    });
  },
);
