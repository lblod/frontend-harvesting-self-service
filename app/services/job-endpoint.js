import Service, { service } from '@ember/service';

const SCRAPER = 'http://lblod.data.gift/services/scraper';

function endpointQuery(uri) {
  return `
    SELECT ?source WHERE {
      ?task <http://purl.org/dc/terms/isPartOf> <${uri}> ;
        <http://redpencil.data.gift/vocabularies/tasks/index> ?index ;
        <http://redpencil.data.gift/vocabularies/tasks/inputContainer> ?container .
      FILTER(STR(?index) = "0")
      ?container <http://redpencil.data.gift/vocabularies/tasks/hasHarvestingCollection> ?collection .
      ?collection <http://purl.org/dc/terms/hasPart> ?remoteDataObject .
      ?remoteDataObject <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#url> ?source .
      FILTER NOT EXISTS { ?remoteDataObject <http://purl.org/dc/terms/creator> <${SCRAPER}> . }
      OPTIONAL { ?remoteDataObject <http://purl.org/dc/terms/created> ?created . }
    } ORDER BY ?created LIMIT 1
  `;
}

export default class JobEndpointService extends Service {
  @service sparql;

  // Stores promises rather than values so concurrent lookups share one query.
  #cache = new Map();

  /**
   * Resolves to the endpoint URL of a scheduled job or job, or null if it has none.
   * Only found endpoints stay cached: a job can get its tasks after it was
   * created, and a failed lookup should be retried on the next call.
   */
  lookup(uri) {
    if (!uri) {
      return Promise.resolve(null);
    }
    if (!this.#cache.has(uri)) {
      this.#cache.set(uri, this.#fetch(uri));
    }
    return this.#cache.get(uri);
  }

  invalidate(uri) {
    this.#cache.delete(uri);
  }

  async #fetch(uri) {
    try {
      const rows = await this.sparql.query(endpointQuery(uri));
      const source = rows[0]?.source?.value ?? null;
      if (!source) {
        this.invalidate(uri);
      }
      return source;
    } catch (error) {
      this.invalidate(uri);
      throw error;
    }
  }
}
