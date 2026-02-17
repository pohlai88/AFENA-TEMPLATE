# afenda-architecture

## Description
Guide to AFENDA-NEXUS monorepo architecture: 4-layer structure, dependency rules, package governance, and architectural decision-making.

## Trigger Conditions
Use this skill when:
- Creating or modifying packages
- Resolving dependency issues
- Planning new features across layers
- Reviewing architectural decisions
- Questions about "where should this code go?"
- Questions about package dependencies

---

## Architecture Overview

AFENDA-NEXUS follows a **strict 4-layer architecture** with bottom-up dependency flow:

```
Layer 3: Application (crud, observability)
         ↓
Layer 2: Domain Services (accounting, inventory, crm, workflow, etc.)
         ↓
Layer 1: Foundation (canon, database, logger, ui)
         ↓
Layer 0: Configuration (eslint-config, typescript-config)
```

**Core Principle**: Lower layers have **no knowledge** of upper layers. Dependencies only flow upward.

---

## Layer Definitions

### Layer 0: Configuration
**Packages**: `eslint-config`, `typescript-config`

**Purpose**: Shared tooling and build configuration.

**Dependency Rules**:
- ✅ External npm packages only
- ❌ **NO** workspace dependencies

**Rationale**: Must be self-contained to avoid circular dependencies during tooling setup.

---

### Layer 1: Foundation
**Packages**: `canon`, `database`, `logger`, `ui`

**Purpose**: Core primitives, types, schemas, and infrastructure.

**Dependency Rules**:
- ✅ Layer 0 (config packages)
- ✅ External npm packages
- ❌ **NO** Layer 1, 2, or 3 workspace dependencies

**Special Rules**:
- **`canon`**: The type system root - zero workspace dependencies
- **`database`**: Data access root - zero workspace dependencies  
- **`logger`**: Infrastructure logging - zero workspace dependencies
- **`ui`**: Presentation components - zero workspace dependencies

**Key Packages**:

#### `canon` (211+ entity types)
The single source of truth for types, schemas, and contracts:
- Entity type definitions
- Action types and verbs
- Policy types (permissions, scopes)
- Validation schemas (Zod)
- ERP adapter contracts

#### `database` (150+ tables)
Database schema and ORM configuration:
- Drizzle table definitions
- Schema helpers (base-entity, doc-entity, erp-entity)
- DB utilities (retry, batch, tenant policy)
- 72+ migration scripts
- Code generators

#### `logger`
Structured logging via Pino:
- Request/response logging
- Error tracking
- Performance metrics

#### `ui`
Reusable UI components:
- Shared React components
- Design system primitives

---

### Layer 2: Domain Services
**Packages**: `workflow`, `advisory`, `search`, `migration`, `accounting`, `inventory`, `crm`, `intercompany`, `procurement`, `purchasing`

**Purpose**: Domain-specific business logic and rules.

**Dependency Rules**:
- ✅ Layer 0 (config)
- ✅ Layer 1 (foundation)
- ✅ External npm packages
- ⚠️ **LIMITED** cross-Layer 2 dependencies (requires justification)
- ❌ **NO** Layer 3 (application)

**Critical Rule**: Domain services **MUST NOT** call CRUD operations (creates circular dependency).

**When to Allow Cross-Layer 2 Dependencies**:
1. ✅ **Justified**: `procurement` → `workflow` (workflow is infrastructure-like)
2. ✅ **Justified**: `purchasing` → `procurement` (clear upstream dependency)
3. ⚠️ **Review Required**: `accounting` → `inventory` (consider orchestration in Layer 3)
4. ❌ **Prohibited**: `search` → `advisory` (no clear business reason)

**If Tempted to Add Cross-Layer 2 Dependency**:
1. Can shared logic be extracted to Layer 1?
2. Should Layer 3 orchestrate both services instead?
3. Is there a clear, documented business justification?

**Key Domain Packages**:
- **`workflow`**: State machines, transitions, approval chains
- **`advisory`**: Business rules and recommendation engine
- **`accounting`**: GL accounts, journal entries, fiscal periods
- **`inventory`**: Items, stock tracking, landed costs
- **`crm`**: Contacts, companies, relationships
- **`intercompany`**: Cross-company transactions
- **`procurement`**: Purchase requisitions, RFQs
- **`purchasing`**: Purchase orders, receiving

---

### Layer 3: Application
**Packages**: `crud`, `observability`

**Purpose**: Orchestrate domain services, enforce policies, manage entity lifecycle.

**Dependency Rules**:
- ✅ **ALL** lower layers (0, 1, 2)
- ✅ External npm packages

**Key Responsibilities**:
1. **`crud`**: 
   - Orchestrates domain services
   - Enforces authorization policies
   - Manages audit logging
   - Handles entity CRUD operations
   - Composes cross-domain workflows

2. **`observability`**:
   - OpenTelemetry integration
   - Distributed tracing
   - Metrics collection
   - Health checks

**Critical Rule**: Layer 3 is the **only** layer that can orchestrate multiple domain services together.

---

## Dependency Validation

### Automated Enforcement
Run dependency validator:
```bash
pnpm validate:deps
```

This checks:
- Layer isolation rules
- Circular dependencies
- Forbidden cross-layer references

### Manual Review Checklist
When adding a new dependency:
1. ✅ Is the target package in a lower layer?
2. ✅ Is there a clear business justification?
3. ✅ Does it create a circular dependency?
4. ✅ Could the logic be refactored to avoid the dependency?

---

## Package Creation Guidelines

### 1. Determine the Correct Layer

**Ask These Questions**:
- **Layer 0**: Is this purely tooling/configuration? → `eslint-config`, `typescript-config`
- **Layer 1**: Is this a core primitive used everywhere? → `canon`, `database`, `logger`, `ui`
- **Layer 2**: Is this domain-specific business logic? → `accounting`, `inventory`, `crm`
- **Layer 3**: Does it orchestrate multiple domains? → `crud`, `observability`

### 2. Package Naming Conventions
- **Singular nouns**: `workflow`, `inventory`, `accounting`
- **Domain-focused**: Reflects business capability, not technical implementation
- **Avoid technical suffixes**: `accounting`, not `accounting-service`

### 3. Required Files
Every package must have:
- `package.json` (with correct dependencies)
- `tsconfig.json` (extends from `typescript-config`)
- `README.md` (purpose, API, examples)
- `src/index.ts` (public API barrel export)

### 4. Public API (`src/index.ts`)
Only export what other packages need:
```typescript
// ✅ Good - explicit public API
export { WorkflowEngine } from './workflow-engine.js'
export type { WorkflowState } from './types.js'

// ❌ Bad - exposes internals
export * from './internal-helpers.js'
```

---

## Common Anti-Patterns

### ❌ Anti-Pattern 1: Layer 2 Calling CRUD
```typescript
// ❌ BAD - Domain service calling application layer
import { createEntity } from '@afenda/crud'

export class InventoryService {
  async createItem(data: ItemInput) {
    return createEntity('item', data) // CIRCULAR DEPENDENCY!
  }
}
```

**Solution**: CRUD calls domain services, not the reverse:
```typescript
// ✅ GOOD - Domain service exposes logic, CRUD orchestrates
export class InventoryService {
  async calculateStockLevel(itemId: string) {
    // Pure business logic, no CRUD calls
  }
}

// In CRUD layer:
import { inventoryService } from '@afenda/inventory'
export async function createItem(data: ItemInput) {
  const item = await db.insert(items).values(data)
  await inventoryService.calculateStockLevel(item.id)
  return item
}
```

### ❌ Anti-Pattern 2: Foundation Depending on Domain
```typescript
// ❌ BAD - canon importing from accounting
import { Account } from '@afenda/accounting'
```

**Solution**: Types belong in `canon`, logic in domain:
```typescript
// In canon:
export interface Account {
  id: string
  name: string
  type: AccountType
}

// In accounting:
import type { Account } from '@afenda/canon'
export class AccountingService {
  // Business logic using canon types
}
```

### ❌ Anti-Pattern 3: Multiple Cross-Layer 2 Dependencies
```typescript
// ❌ BAD - domain service depending on many peers
import { InventoryService } from '@afenda/inventory'
import { AccountingService } from '@afenda/accounting'
import { CRMService } from '@afenda/crm'

export class OrderService {
  // This is orchestration, belongs in Layer 3!
}
```

**Solution**: Move to CRUD (Layer 3):
```typescript
// ✅ GOOD - orchestration in application layer
// In crud package:
import { inventoryService } from '@afenda/inventory'
import { accountingService } from '@afenda/accounting'
import { crmService } from '@afenda/crm'

export async function processOrder(orderId: string) {
  // Orchestrate multiple domains
}
```

---

## When to Split a Package

**Split when**:
- Package exceeds 2000 lines of code
- Multiple unrelated concerns (e.g., `canon` becoming too large)
- Domain logic becomes too broad (e.g., split `purchasing` from `procurement`)

**How to split**:
1. Identify cohesive subdomains
2. Create new Layer 2 package
3. Move types to `canon` if shared
4. Update dependencies in parent package
5. Run `pnpm validate:deps`

---

## Circular Dependency Prevention

### Detection
```bash
pnpm validate:deps
```

### Common Causes
1. **Layer 2 ↔ Layer 3**: Domain calls CRUD, CRUD calls domain
2. **Cross-Layer 2**: Service A imports Service B, Service B imports Service A
3. **Foundation ↔ Domain**: `canon` imports from domain package

### Resolution Strategies
1. **Extract to Lower Layer**: Move shared code to Layer 1
2. **Inversion of Control**: Use dependency injection
3. **Event-Driven**: Emit events instead of direct calls
4. **Orchestration Layer**: Move composition to Layer 3

---

## Architecture Decision Records (ADRs)

See [docs/adr/](../../../docs/adr/) for architectural decisions:
- [ADR-001: Use Neon Postgres](../../../docs/adr/001-use-neon-postgres.md)
- [ADR-002: Monorepo with Turborepo](../../../docs/adr/002-monorepo-with-turborepo.md)
- [ADR-003: TypeScript Strict Mode](../../../docs/adr/003-typescript-strict-mode.md)
- [ADR-004: OpenTelemetry Observability](../../../docs/adr/004-opentelemetry-observability.md)
- [ADR-005: Shared Package Structure](../../../docs/adr/005-shared-package-structure.md)
- [ADR-006: Neon Auth Authentication](../../../docs/adr/006-neon-auth-authentication.md)

---

## References

- [ARCHITECTURE.md](../../../ARCHITECTURE.md) - Full architecture documentation
- [packages/GOVERNANCE.md](../../../packages/GOVERNANCE.md) - Detailed governance rules
- [packages/PACKAGE_TEMPLATE.md](../../../packages/PACKAGE_TEMPLATE.md) - Package creation template
- [tools/scripts/validate-deps.ts](../../../tools/scripts/validate-deps.ts) - Dependency validator
- [docs/BUILD_STRATEGY.md](../../../docs/BUILD_STRATEGY.md) - Build and deployment strategy

---

## Quick Reference

### Layer Dependency Matrix

| From Layer | Can Depend On |
|------------|---------------|
| Layer 0 | External only |
| Layer 1 | Layer 0, External |
| Layer 2 | Layer 0, 1, (Limited Layer 2), External |
| Layer 3 | Layer 0, 1, 2, External |

### Package Count by Layer (Current)
- **Layer 0**: 2 packages (config)
- **Layer 1**: 4 packages (foundation)
- **Layer 2**: 10 packages (domain)
- **Layer 3**: 2 packages (application)
- **Total**: 18 packages

### Common Commands
```bash
# Validate dependencies
pnpm validate:deps

# Build entire monorepo
pnpm build

# Run tests
pnpm test

# Type check
pnpm type-check
```
