import { modifier } from 'ember-modifier';
import Yasgui from '@triply/yasgui';
import env from '../config/environment';

const defaultQuery =
  env.yasgui.defaultQuery !== 'EMBER_YASGUI_DEFAULT_QUERY'
    ? env.yasgui.defaultQuery
    : `PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
PREFIX lblodlg: <http://data.lblod.info/vocabularies/leidinggevenden/>

SELECT DISTINCT ?type WHERE {
  ?s a ?type .
} LIMIT 10
`;

export default modifier(
  (element) => {
    const yasgui = new Yasgui(element, {
      requestConfig: { endpoint: '/sparql' },
      autofocus: true,
    });

    yasgui.config.yasqe.value = defaultQuery;
    if (env.yasgui.extraPrefixes !== 'EMBER_YASGUI_EXTRA_PREFIXES')
      yasgui.config.yasqe.addPrefixes(JSON.parse(env.yasgui.extraPrefixes));
  },
  { eager: false }
);
