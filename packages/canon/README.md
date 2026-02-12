# afena-canon

Shared type contracts, Zod schemas, and error taxonomy for the Afena Interaction Kernel (AIK).

## Public API

### Types

- `EntityType`, `EntityRef`, `BaseEntity` — entity identity
- `ActorRef` — mutation actor (userId, orgId, roles)
- `ActionVerb`, `ActionType`, `ActionFamily` — namespaced action taxonomy
- `MutationSpec`, `JsonValue` — mutation input shape
- `Receipt`, `ReceiptStatus` — deterministic mutation response
- `ApiResponse` — standard API envelope
- `ErrorCode`, `KernelError` — error taxonomy (7 codes)
- `AuditLogEntry` — audit trail record

### Zod Schemas

Every type above has a matching Zod schema for runtime validation:
`entityRefSchema`, `mutationSpecSchema`, `receiptSchema`, `errorCodeSchema`, etc.

### Helpers

- `extractVerb(actionType)` — get verb from `entity.verb` string
- `extractEntityNamespace(actionType)` — get entity name
- `getActionFamily(actionType)` — map action to CRUD-SAP family

## Usage

```typescript
import { mutationSpecSchema, type MutationSpec } from 'afena-canon';

const spec = mutationSpecSchema.parse(input);
```

## Invariants

- Action types follow `{entity}.{verb}` pattern (K-06, K-15)
- Error codes are a closed enum of 7 values
- All schemas use Zod v4
