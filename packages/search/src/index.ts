export { toTsQuery, ftsWhere, ftsRank, ilikeFallback } from './fts';
export { registerSearchableEntity, getRegisteredEntityTypes, crossEntitySearch } from './registry';
export { searchAll } from './adapters/cross-entity';
export { searchContacts } from './adapters/contacts';
export { refreshSearchIndex } from './refresh';
export {
  backfillSearchDocuments,
  backfillSearchDocumentsChunk,
  isSearchDocumentsEmpty,
  isBackfillComplete,
} from './backfill';
export {
  processSearchOutboxBatch,
  drainSearchOutbox,
  runSearchWorker,
  type SearchWorkerConfig,
  type SearchOutboxEvent,
} from './worker/search-worker';

export type { SearchResult, SearchOptions, SearchableEntityConfig } from './types';
