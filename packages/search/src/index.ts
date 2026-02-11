export { toTsQuery, ftsWhere, ftsRank, ilikeFallback } from './fts';
export { registerSearchableEntity, getRegisteredEntityTypes, crossEntitySearch } from './registry';
export { searchContacts } from './adapters/contacts';

export type { SearchResult, SearchOptions, SearchableEntityConfig } from './types';
