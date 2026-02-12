# afena-search

Full-text search helpers and cross-entity search registry for the Afena platform.

## Public API

### FTS Helpers

- `toTsQuery(query)` — convert user input to PostgreSQL tsquery
- `ftsWhere(column, query)` — generate tsvector WHERE clause
- `ftsRank(column, query)` — generate ts_rank ORDER BY
- `ilikeFallback(columns, query)` — ILIKE fallback for non-FTS columns

### Registry

- `registerSearchableEntity(config)` — register an entity type for cross-entity search
- `getRegisteredEntityTypes()` — list registered entity types
- `crossEntitySearch(query, options)` — fan-out search across all registered entities

### Adapters

- `searchContacts(query, options)` — contacts-specific search adapter (ILIKE)

## Usage

```typescript
import { crossEntitySearch, registerSearchableEntity } from 'afena-search';

registerSearchableEntity({ type: 'contacts', adapter: searchContacts });
const results = await crossEntitySearch('acme', { limit: 10 });
```

## Dependencies

`afena-database`, `drizzle-orm`
