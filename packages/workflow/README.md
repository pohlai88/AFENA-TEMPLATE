# afena-workflow

Rule engine for before/after mutation hooks in the Afena Interaction Kernel.

## Public API

### Engine

- `evaluateRules(timing, spec, entity, ctx)` — evaluate all matching rules for a mutation

### Registry

- `registerRule(rule)` — register a workflow rule (sorted by priority)
- `unregisterRule(id)` — remove a rule by ID
- `getRegisteredRules()` — list all registered rules
- `clearRules()` — remove all rules

### Built-in Conditions

- `always` / `never` — constant matchers
- `fieldEquals(field, value)` — input field equality
- `fieldChanged(field)` — field differs from entity snapshot
- `actorHasRole(role)` — actor role check
- `allOf(...conds)` / `anyOf(...conds)` — AND/OR combinators

## Usage

```typescript
import { registerRule, fieldEquals } from 'afena-workflow';

registerRule({
  id: 'require-email',
  name: 'Require email on create',
  timing: 'before',
  entityTypes: ['contacts'],
  verbs: ['create'],
  priority: 50,
  enabled: true,
  condition: fieldEquals('email', undefined),
  action: () => ({ ok: false, message: 'Email is required' }),
});
```

## How It Works

- **Before-rules**: Can block or enrich mutations (runs inside `mutate()` before transaction)
- **After-rules**: Fire-and-forget side effects (runs after transaction commit, errors swallowed)

## Dependencies

`afena-canon`
