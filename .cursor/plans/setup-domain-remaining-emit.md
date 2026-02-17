# Setup Domain — Remaining to Emit (Architecture-Compliant)

**Compliance sources:** [AGENT.md](../axis-erp/AGENT.md), [module-structure.md](../axis-erp/docs/architecture/module-structure.md)

---

## Phase 0: Fix Pre-Existing Compliance Violations

The current setup domain violates AGENT.md and module-structure.md conventions. Fix before adding new artifacts.

### File Naming (kebab-case required)

| Current (wrong) | Correct |
|----------------|---------|
| `setup/services/ConvertCurrency.ts` | `setup/services/convert-currency.ts` |
| `setup/ports/FxReadPort.ts` | `setup/ports/fx-read-port.ts` |
| `__tests__/setup/services/ConvertCurrency.test.ts` | `__tests__/setup/services/convert-currency.test.ts` |

**Actions:**
1. Rename `ConvertCurrency.ts` → `convert-currency.ts`
2. Rename `FxReadPort.ts` → `fx-read-port.ts`
3. Rename `ConvertCurrency.test.ts` → `convert-currency.test.ts`
4. Update all imports and barrel exports (`setup/services/index.ts`, `setup/ports/index.ts`, test file)

### Domain README (required per module-structure)

Create `setup/README.md` per [module-structure.md](../axis-erp/docs/architecture/module-structure.md) template:
- Purpose, key services, key policies, ports, usage example

### Dependency Direction (AGENT.md)

Verify: Services → Policies → Ports. Policies may depend on Ports. Value objects have no dependencies. Current setup is correct.

---

## Architecture Compliance Summary

| Rule | Source | Application |
|------|--------|-------------|
| File naming: kebab-case | module-structure | All files: `convert-currency.ts`, `fx-read-port.ts` |
| Test location: `__tests__/{domain}/{module}/` | AGENT.md, module-structure | Canonical test directory |
| Test naming: `{kebab}.test.ts` | module-structure | `convert-currency.test.ts` |
| Ports: interfaces only, no `I` prefix | AGENT.md | `FxReadPort`, not `IFxReadPort` |
| Policies with ports: class + constructor injection | module-structure | `IsWorkingDayPolicy(holidayPort: HolidayReadPort)` |
| Value objects: immutable, private constructor, static create | module-structure | `ApprovalDecision.create()`, `HolidayDate.create()` |
| Barrel exports: every folder has index.ts | module-structure | Already present |
| Domain generator: ServiceEmitter + PortEmitter only | tools/domain-generator | No PolicyEmitter; policies/value-objects manual |

---

## Source vs Implemented

### Implemented (post Phase 0)

| Module | File | Artifact | Compliant |
|--------|------|----------|-----------|
| services | convert-currency.ts | ConvertCurrency | Yes |
| policies | fx-rate-validation.ts | validateRate | Yes |
| value-objects | rate-snapshot.ts | RateSnapshot, convertAmount | Yes |
| ports | fx-read-port.ts | FxReadPort | Yes |
| types | result.ts, primitives.ts | ValidationResult, IsoDate, etc. | Yes |

### Remaining to Emit

Aligned with [SETUP_DOMAIN_ADOPTION_STRATEGY.md](../.windsurf/plans/SETUP_DOMAIN_ADOPTION_STRATEGY.md) entity relationships.

---

## 1. Default Value Resolution (global-defaults)

**Emit via domain generator** (ServiceEmitter + PortEmitter).

| Kind | File | Artifact |
|------|------|----------|
| Service | setup/services/default-value-resolver.ts | DefaultValueResolver |
| Port | setup/ports/global-defaults-read-port.gen.ts | GlobalDefaultsReadPort |
| Test | __tests__/setup/services/default-value-resolver.test.ts | |

**Spec** (`tools/domain-generator/specs/setup/default-value-resolver.spec.json`):

```json
{
  "id": "setup.defaultValueResolver",
  "version": 1,
  "domain": "setup",
  "module": "services",
  "name": "DefaultValueResolver",
  "kind": "service",
  "adoption": "scaffold",
  "operations": [{
    "name": "resolveDefault",
    "inputs": [
      {"name": "orgId", "type": "string", "required": true},
      {"name": "key", "type": "DefaultKey", "required": true},
      {"name": "context", "type": "ResolveContext", "required": false}
    ],
    "output": {"name": "value", "type": "string | null", "required": true},
    "ports": ["GlobalDefaultsReadPort"]
  }]
}
```

**Generator output:** `default-value-resolver.gen.ts`, `default-value-resolver.ts`, `global-defaults-read-port.gen.ts`, `index.gen.ts` (ports). Add types to `setup/types/` for DefaultKey, ResolveContext.

---

## 2. Initialization Validation (org bootstrap)

**Manual creation** (no PolicyEmitter). Pure policy, no ports.

| Kind | File | Artifact |
|------|------|----------|
| Policy | setup/policies/initialization-policy.ts | getRequiredSettings(), validateInitialization() |
| Test | __tests__/setup/policies/initialization-policy.test.ts | |

**Pattern:** Function-based policy (like fx-rate-validation) or interface + implementation. No port dependency.

---

## 3. Working Day / Holiday Logic (holiday-lists, holidays)

**Manual creation.** Policy depends on port — use class with constructor injection per module-structure.

| Kind | File | Artifact |
|------|------|----------|
| Port | setup/ports/holiday-read-port.ts | HolidayReadPort (interface) |
| Policy | setup/policies/is-working-day-policy.ts | IsWorkingDayPolicy (class) |
| Value Object | setup/value-objects/holiday-date.ts | HolidayDate (class, immutable) |
| Test | __tests__/setup/policies/is-working-day-policy.test.ts | |

**Port interface** (manual, kebab-case file):

```typescript
// setup/ports/holiday-read-port.ts
export interface HolidayReadPort {
  getHolidaysForList(orgId: string, holidayListId: string): Promise<HolidayDate[]>;
}
```

**Policy class** (depends on port):

```typescript
// setup/policies/is-working-day-policy.ts
export class IsWorkingDayPolicy {
  constructor(private holidayPort: HolidayReadPort) {}
  async isWorkingDay(orgId: string, holidayListId: string, date: IsoDate): Promise<boolean> { ... }
  async getNextWorkingDay(...): Promise<IsoDate> { ... }
}
```

**Value object** (module-structure pattern):

```typescript
// setup/value-objects/holiday-date.ts
export class HolidayDate {
  private constructor(public readonly date: IsoDate, public readonly description: string) {}
  static create(date: IsoDate, description: string): HolidayDate { ... }
  equals(other: HolidayDate): boolean { ... }
}
```

---

## 4. Authorization Policy (authorization-controls, authorization-rules)

**Manual creation.** Policy depends on port.

| Kind | File | Artifact |
|------|------|----------|
| Port | setup/ports/authorization-rules-read-port.ts | AuthorizationRulesReadPort |
| Policy | setup/policies/authorization-rule-evaluator.ts | AuthorizationRuleEvaluator (class) |
| Value Object | setup/value-objects/approval-decision.ts | ApprovalDecision (class) |
| Test | __tests__/setup/policies/authorization-rule-evaluator.test.ts | |

**Value object** (immutable, private constructor, static create):

```typescript
// setup/value-objects/approval-decision.ts
export class ApprovalDecision {
  private constructor(
    public readonly outcome: 'approve' | 'deny',
    public readonly ruleId: string,
    public readonly reasons: Reason[]
  ) {}
  static create(outcome: 'approve' | 'deny', ruleId: string, reasons: Reason[]): ApprovalDecision { ... }
}
```

---

## 5. Config Validation Policies (deferred)

Low priority. Most validation is schema-level in packages/crud.

---

## Emit Order

1. **Phase 0** — Fix compliance (rename files, add README)
2. **DefaultValueResolver** — Domain generator (service + port)
3. **InitializationPolicy** — Manual (pure policy)
4. **IsWorkingDayPolicy** — Manual (policy + port + value object)
5. **AuthorizationRuleEvaluator** — Manual (policy + port + value object)

---

## Emit Mechanism Summary

| Artifact | Mechanism | Output Paths |
|----------|------------|--------------|
| DefaultValueResolver | Domain generator (spec) | setup/services/default-value-resolver.{gen,}.ts, setup/ports/global-defaults-read-port.gen.ts |
| InitializationPolicy | Manual | setup/policies/initialization-policy.ts |
| IsWorkingDayPolicy | Manual | setup/policies/is-working-day-policy.ts, setup/ports/holiday-read-port.ts, setup/value-objects/holiday-date.ts |
| AuthorizationRuleEvaluator | Manual | setup/policies/authorization-rule-evaluator.ts, setup/ports/authorization-rules-read-port.ts, setup/value-objects/approval-decision.ts |

**Tests:** All under `axis-erp/__tests__/setup/` (canonical test directory), kebab-case filenames.

---

## Summary Table

| Artifact | Module | File (kebab-case) | Entity Mapping | Priority |
|----------|--------|-------------------|----------------|----------|
| DefaultValueResolver | services | default-value-resolver.ts | global-defaults | High |
| GlobalDefaultsReadPort | ports | global-defaults-read-port.gen.ts | global-defaults | High |
| InitializationPolicy | policies | initialization-policy.ts | All singletons | High |
| IsWorkingDayPolicy | policies | is-working-day-policy.ts | holiday-lists, holidays | High |
| HolidayReadPort | ports | holiday-read-port.ts | holiday-lists, holidays | High |
| HolidayDate | value-objects | holiday-date.ts | holidays | High |
| AuthorizationRuleEvaluator | policies | authorization-rule-evaluator.ts | authorization-controls, authorization-rules | Medium |
| AuthorizationRulesReadPort | ports | authorization-rules-read-port.ts | authorization-rules | Medium |
| ApprovalDecision | value-objects | approval-decision.ts | — | Medium |
