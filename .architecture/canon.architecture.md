# afenda Canon (Type Authority) — Architecture Reference

> **Auto-generated** by `afenda readme gen` at 2026-02-16T12:44:12Z. Do not edit — regenerate instead.
> **Package:** `afenda-canon` (`packages/canon`)
> **Purpose:** Single source of truth for all types, schemas, enums, and capability definitions across the monorepo.

---

## 1. Architecture Overview

Canon is the **type authority** package — every other package imports its contracts from here.
It defines the vocabulary of the entire system: entity types, action types, error codes,
capability keys, Zod validation schemas, and RBAC tier mappings.

**Zero runtime dependencies.** Canon is pure TypeScript types + Zod schemas + const objects.
It never imports from any other workspace package.

---

## 2. Key Design Decisions

- **ActionType formula**: `${entityType}.${verb}` — canonical, no exceptions
- **Capability key shapes**: 3 discriminated union shapes (domain.verb, domain.namespace.verb, namespace.verb)
- **Zod v4**: strict mode, `z.record()` requires 2 args, UUID validation is RFC 4122 strict
- **VIS_POLICY**: phase-aware visibility rules encoded as const objects (not runtime config)
- **CAPABILITY_CATALOG**: 26 capabilities with kind, tier, scope, status, entities, risks

---

## 3. Package Structure (live)

| Metric                 | Value                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| **Source files**       | 60                                                                    |
| **Test files**         | 0                                                                     |
| **Source directories** | adapters, contracts, enums, schemas, serialization, types, validators |

```
packages/canon/src/
├── adapters/
├── contracts/
├── enums/
├── schemas/
├── serialization/
├── types/
├── validators/
```

---

## 4. Public API (barrel exports)

### Value Exports

| Export                               | Source                            |
| ------------------------------------ | --------------------------------- |
| `ENTITY_TYPES`                       | `./types/entity`                  |
| `SYSTEM_ACTOR_USER_ID`               | `./types/actor`                   |
| `LifecycleError`                     | `./types/lifecycle`               |
| `ACTION_VERBS`                       | `./types/action`                  |
| `ACTION_TYPES`                       | `./types/action`                  |
| `ACTION_FAMILIES`                    | `./types/action`                  |
| `extractVerb`                        | `./types/action`                  |
| `extractEntityNamespace`             | `./types/action`                  |
| `getActionFamily`                    | `./types/action`                  |
| `ERROR_CODES`                        | `./types/errors`                  |
| `RateLimitError`                     | `./types/errors`                  |
| `CAPABILITY_KINDS`                   | `./types/capability`              |
| `CAPABILITY_DOMAINS`                 | `./types/capability`              |
| `CAPABILITY_NAMESPACES`              | `./types/capability`              |
| `CAPABILITY_VERBS`                   | `./types/capability`              |
| `CAPABILITY_CATALOG`                 | `./types/capability`              |
| `CAPABILITY_KEYS`                    | `./types/capability`              |
| `RBAC_TIERS`                         | `./types/capability`              |
| `RBAC_SCOPES`                        | `./types/capability`              |
| `VERB_TO_KIND`                       | `./types/capability`              |
| `VIS_POLICY`                         | `./types/capability`              |
| `ACTION_FAMILY_TO_TIER`              | `./types/capability`              |
| `KIND_TO_TIER`                       | `./types/capability`              |
| `KIND_TO_SCOPE`                      | `./types/capability`              |
| `parseCapabilityKey`                 | `./types/capability`              |
| `validateCapabilityKey`              | `./types/capability`              |
| `inferKindFromVerb`                  | `./types/capability`              |
| `entityTypeSchema`                   | `./schemas/entity`                |
| `entityRefSchema`                    | `./schemas/entity`                |
| `actionTypeSchema`                   | `./schemas/action`                |
| `actionFamilySchema`                 | `./schemas/action`                |
| `errorCodeSchema`                    | `./schemas/errors`                |
| `kernelErrorSchema`                  | `./schemas/errors`                |
| `mutationSpecSchema`                 | `./schemas/mutation`              |
| `receiptStatusSchema`                | `./schemas/receipt`               |
| `receiptSchema`                      | `./schemas/receipt`               |
| `apiResponseSchema`                  | `./schemas/envelope`              |
| `auditLogEntrySchema`                | `./schemas/audit`                 |
| `capabilityKindSchema`               | `./schemas/capability`            |
| `capabilityStatusSchema`             | `./schemas/capability`            |
| `capabilityScopeSchema`              | `./schemas/capability`            |
| `capabilityRiskSchema`               | `./schemas/capability`            |
| `rbacTierSchema`                     | `./schemas/capability`            |
| `rbacScopeSchema`                    | `./schemas/capability`            |
| `capabilityDescriptorSchema`         | `./schemas/capability`            |
| `exceptionScopeSchema`               | `./schemas/capability`            |
| `capabilityExceptionSchema`          | `./schemas/capability`            |
| `capabilityExceptionsFileSchema`     | `./schemas/capability`            |
| `capabilityDomainSchema`             | `./schemas/capability`            |
| `capabilityNamespaceSchema`          | `./schemas/capability`            |
| `TYPE_CONFIG_SCHEMAS`                | `./schemas/data-types`            |
| `getTypeConfigSchema`                | `./schemas/data-types`            |
| `validateTypeConfig`                 | `./schemas/data-types`            |
| `coerceMutationInput`                | `./serialization`                 |
| `coerceValue`                        | `./serialization`                 |
| `validateFieldValue`                 | `./validators/custom-field-value` |
| `DATA_TYPE_VALUE_COLUMN_MAP`         | `./validators/custom-field-value` |
| `localEntitySpecSchema`              | `./contracts`                     |
| `validateLocalEntitySpec`            | `./contracts`                     |
| `safeParseLocalEntitySpec`           | `./contracts`                     |
| `invariant`                          | `./invariant`                     |
| `MONEY_POLICY`                       | `./adapters/erpnext`              |
| `RESERVED_WORD_POLICY`               | `./adapters/erpnext`              |
| `resolveAdoptionDecision`            | `./adapters/erpnext`              |
| `buildResolveInput`                  | `./adapters/erpnext`              |
| `type AdoptionLevel`                 | `./adapters/erpnext`              |
| `type LockLevel`                     | `./adapters/erpnext`              |
| `type ReasonCode`                    | `./adapters/erpnext`              |
| `type ResolveAdoptionDecisionInput`  | `./adapters/erpnext`              |
| `type ResolveAdoptionDecisionOutput` | `./adapters/erpnext`              |
| `type AdoptedEntitiesFile`           | `./adapters/erpnext`              |
| `type LoadedAdoptionConfig`          | `./adapters/erpnext`              |

### Type Exports

| Type                    | Source                            |
| ----------------------- | --------------------------------- |
| `EntityType`            | `./types/entity`                  |
| `EntityRef`             | `./types/entity`                  |
| `BaseEntity`            | `./types/entity`                  |
| `ActorRef`              | `./types/actor`                   |
| `PermissionVerb`        | `./types/policy`                  |
| `PolicyDecision`        | `./types/policy`                  |
| `PolicyDenyReason`      | `./types/policy`                  |
| `FieldRules`            | `./types/policy`                  |
| `ResolvedPermission`    | `./types/policy`                  |
| `UserScopeAssignment`   | `./types/policy`                  |
| `ResolvedActor`         | `./types/policy`                  |
| `AuthoritySnapshotV2`   | `./types/policy`                  |
| `LifecycleDenyReason`   | `./types/lifecycle`               |
| `ActionVerb`            | `./types/action`                  |
| `ActionType`            | `./types/action`                  |
| `ActionFamily`          | `./types/action`                  |
| `ActionKind`            | `./types/action-spec`             |
| `ActionGroup`           | `./types/action-spec`             |
| `ResolvedAction`        | `./types/action-spec`             |
| `ResolvedUpdateMode`    | `./types/action-spec`             |
| `ResolvedActions`       | `./types/action-spec`             |
| `ActionEnvelope`        | `./types/action-spec`             |
| `EntityContract`        | `./types/entity-contract`         |
| `LifecycleTransition`   | `./types/entity-contract`         |
| `JsonValue`             | `./types/mutation`                |
| `MutationSpec`          | `./types/mutation`                |
| `ReceiptStatus`         | `./types/receipt`                 |
| `Receipt`               | `./types/receipt`                 |
| `ApiResponse`           | `./types/envelope`                |
| `ErrorCode`             | `./types/errors`                  |
| `KernelError`           | `./types/errors`                  |
| `AuditLogEntry`         | `./types/audit`                   |
| `CapabilityKind`        | `./types/capability`              |
| `CapabilityKey`         | `./types/capability`              |
| `CapabilityDomain`      | `./types/capability`              |
| `CapabilityNamespace`   | `./types/capability`              |
| `RbacTier`              | `./types/capability`              |
| `RbacScope`             | `./types/capability`              |
| `ParsedCapabilityKey`   | `./types/capability`              |
| `CapabilityDescriptor`  | `./types/capability`              |
| `CapabilityStatus`      | `./types/capability`              |
| `CapabilityScope`       | `./types/capability`              |
| `CapabilityRisk`        | `./types/capability`              |
| `VisPolicy`             | `./types/capability`              |
| `ExceptionScope`        | `./schemas/capability`            |
| `CapabilityException`   | `./schemas/capability`            |
| `TypeConfigSchemas`     | `./schemas/data-types`            |
| `FieldValidationResult` | `./validators/custom-field-value` |
| `LocalEntitySpec`       | `./contracts`                     |
| `EntityKind`            | `./contracts`                     |
| `FieldType`             | `./contracts`                     |
| `FieldDef`              | `./contracts`                     |

---

## 5. Dependencies

### Internal (workspace)

- `afenda-eslint-config`
- `afenda-typescript-config`

### External

| Package | Version    |
| ------- | ---------- |
| `zod`   | `catalog:` |

---

## 6. Invariants

- `INVARIANT-ADOPT`
- `INVARIANT-LOCK`
- `K-04`
- `K-06`
- `K-07`
- `K-09`
- `K-10`
- `K-12`

---

## Design Patterns Detected

- **Factory**
- **Registry**

---

## Cross-References

- [`crud.architecture.md`](./crud.architecture.md)
- [`business.logic.architecture.md`](./business.logic.architecture.md)
