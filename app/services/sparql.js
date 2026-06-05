import Service from '@ember/service';

export default class SparqlService extends Service {
  async query(sparql) {
    const body = new URLSearchParams({ query: sparql });
    const response = await fetch('/sparql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/sparql-results+json',
      },
      body,
    });
    if (!response.ok) {
      throw new Error(`SPARQL query failed: ${response.status}`);
    }
    const data = await response.json();
    return data.results.bindings;
  }
}
