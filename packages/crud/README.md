# afena-crud

The Afena Interaction Kernel (AIK) — deterministic mutation ledger for all domain data writes.

## Public API

Only 3 functions are exported (K-05):

- `mutate(spec, ctx)` — the single entry point for all domain writes (create, update, delete, restore)
- `readEntity(type, id, ctx)` — read a single entity by ID
- `listEntities(type, ctx, options)` — list entities with filtering/pagination

## Usage

```typescript
import { mutate, readEntity } from 'afena-crud';

const receipt = await mutate({
  actionType: 'contacts.create',
  entityRef: { type: 'contacts' },
  input: { name: 'Acme Corp', email: 'hello@acme.com' },
}, ctx);
```

## Kernel Invariants

- **K-01**: `mutate()` is the only way to write domain data
- **K-02**: Single DB transaction per mutation
- **K-03**: Always writes `audit_logs` + `entity_versions`
- **K-04**: `expectedVersion` required on update/delete/restore
- **K-11**: Allowlist input + kernel backstop strips system columns

## Dependencies

`afena-canon`, `afena-database`, `afena-logger`, `drizzle-orm`, `fast-json-patch`
