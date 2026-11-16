/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | decision-selector-configuration',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders all fields with passed values', async function (assert) {
      this.setProperties({
        decisionUris: 'uri-1\nuri-2',
        targetClassUri: 'class-uri',
        propertyPathForTextUri: 'path-uri',
        setProperty: () => {},
      });

      await render(hbs`<DecisionSelectorConfiguration
      @decisionUris={{this.decisionUris}}
      @targetClassUri={{this.targetClassUri}}
      @propertyPathForTextUri={{this.propertyPathForTextUri}}
      @setProperty={{this.setProperty}}
    />`);

      assert.dom('#task-decisions-uri').hasValue('uri-1\nuri-2');
      assert.dom('#target-class-uri').hasValue('class-uri');
      assert.dom('#property-path-for-text-uri').hasValue('path-uri');
    });

    test('it calls setProperty when decisionUris textarea changes', async function (assert) {
      assert.expect(2);

      this.set('setProperty', (key, event) => {
        assert.strictEqual(key, 'decisionUris');
        assert.strictEqual(event.target.value, 'new value');
      });

      await render(hbs`<DecisionSelectorConfiguration
      @decisionUris=""
      @setProperty={{this.setProperty}}
    />`);

      await fillIn('#task-decisions-uri', 'new value');
    });

    test('it calls setProperty when targetClassUri input changes', async function (assert) {
      assert.expect(2);

      this.set('setProperty', (key, event) => {
        assert.strictEqual(key, 'targetClassUri');
        assert.strictEqual(event.target.value, 'new class');
      });

      await render(hbs`<DecisionSelectorConfiguration
      @targetClassUri=""
      @setProperty={{this.setProperty}}
    />`);

      await fillIn('#target-class-uri', 'new class');
    });

    test('it calls setProperty when propertyPathForTextUri textarea changes', async function (assert) {
      assert.expect(2);

      this.set('setProperty', (key, event) => {
        assert.strictEqual(key, 'propertyPathForTextUri');
        assert.strictEqual(event.target.value, 'new path');
      });

      await render(hbs`<DecisionSelectorConfiguration
      @propertyPathForTextUri=""
      @setProperty={{this.setProperty}}
    />`);

      await fillIn('#property-path-for-text-uri', 'new path');
    });
  },
);
