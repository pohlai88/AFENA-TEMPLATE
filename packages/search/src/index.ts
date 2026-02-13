export { toTsQuery, ftsWhere, ftsRank, ilikeFallback } from './fts';
export { registerSearchableEntity, getRegisteredEntityTypes, crossEntitySearch } from './registry';
export { searchAll } from './adapters/cross-entity';
export { searchContacts } from './adapters/contacts';
export { refreshSearchIndex } from './refresh';

export type { SearchResult, SearchOptions, SearchableEntityConfig } from './types';
