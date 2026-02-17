# Package Governance

This document defines the governance rules and dependency policies for the
AFENDA-NEXUS monorepo. These rules ensure architectural integrity,
maintainability, and scalability.

## Table of Contents

- [Layer Definitions](#layer-definitions)
- [Dependency Rules](#dependency-rules)
- [Enforcement](#enforcement)
- [Exception Process](#exception-process)
- [Package Lifecycle](#package-lifecycle)

---

## Layer Definitions

The monorepo follows a strict 4-layer architecture. Each layer has specific
responsibilities and dependency constraints.

### Layer 0: Configuration

**Packages**: `eslint-config`, `typescript-config`

**Responsibility**: Provide shared tooling and build configuration.

**Allowed Dependencies**:

- ✅ External npm packages (ESLint plugins, TypeScript)
- ❌ **NO** workspace dependencies

**Rationale**: Configuration packages must be self-contained to avoid circular
dependencies during tooling setup.

---

### Layer 1: Foundation

**Packages**: `canon`, `database`, `logger`, `ui`

**Responsibility**: Provide core primitives, types, schemas, and infrastructure.

**Allowed Dependencies**:

- ✅ Layer 0 packages (config)
- ✅ External npm packages (Zod, Drizzle ORM, Pino, React)
- ❌ **NO** workspace dependencies outside Layer 0

**Key Rules**:

1. **`canon`** must have **zero workspace dependencies** - It's the root of the
   type system
2. **`database`** must have **zero workspace dependencies** - It's the root of
   data access
3. **`logger`** must have **zero workspace dependencies** - It's used everywhere
4. **`ui`** must have **zero workspace dependencies** - It's presentation only

**Rationale**: Foundation packages form the base layer. If they depend on higher
layers, circular dependencies become inevitable.

---

### Layer 2: Domain Services

**Packages**:

- `workflow`
- `advisory`
- `search`
- `migration`
- `accounting` (new)
- `inventory` (new)
- `crm` (new)
- `intercompany` (new)

**Responsibility**: Implement domain-specific business logic and rules.

**Allowed Dependencies**:

- ✅ Layer 0 packages (config)
- ✅ Layer 1 packages (canon, database, logger, ui)
- ✅ External npm packages (domain-specific libraries)
- ⚠️ **LIMITED** cross-Layer 2 dependencies (must be justified)
- ❌ **NO** Layer 3 dependencies (application)

**Key Rules**:

1. Domain services should be **self-contained** - minimize cross-dependencies
2. If service A needs service B's logic, consider:
   - Extracting shared logic to Layer 1
   - Orchestrating both from Layer 3 (CRUD)
   - Documenting the dependency with clear rationale
3. Domain services **MUST NOT** call CRUD operations (creates circular
   dependency)

**Cross-Layer 2 Dependency Examples**:

- ✅ `workflow` → `logger` (logging is infrastructure)
- ⚠️ `accounting` → `inventory` (requires review - consider orchestration in
  CRUD)
- ❌ `search` → `advisory` (no clear reason - likely architectural smell)

**Rationale**: Domain services encapsulate business rules. They should be
composable from the application layer, not tightly coupled to each other.

---

### Layer 3: Application

**Packages**: `crud`

**Responsibility**: Orchestrate domain services, enforce policies, manage entity
lifecycle.

**Allowed Dependencies**:

- ✅ **ALL** lower layers (0, 1, 2)
- ✅ External npm packages (Redis, queue libraries, etc.)

**Key Rules**:

1. CRUD is the **orchestration layer** - it composes domain services
2. CRUD enforces **cross-cutting concerns**: authorization, audit logging, rate
   limiting
3. Entity-specific logic goes in **CRUD handlers**, not domain services
4. Domain services should be callable from different orchestrations (API,
   background jobs, CLI)

**What Belongs in CRUD**:

- Policy enforcement (permissions, quotas)
- Lifecycle management (state transitions, hooks)
- Audit logging
- Entity mutation coordination
- Handler registry

**What Does NOT Belong in CRUD**:

- Pure business logic (→ Domain services)
- Schema definitions (→ canon)
- Database tables (→ database)
- Background job workers (→ separate `workers` package, future)

**Rationale**: Application layer coordinates lower layers. It's the only layer
allowed to depend on everything.

---

## Dependency Rules

### Rule 1: Acyclic Dependency Graph (DAG)

**Policy**: The package dependency graph MUST be acyclic.

**Enforcement**:

- Manual review in PRs
- Automated check via `pnpm run validate:deps`

**Violation Example**:

```
❌ canon → database → canon (circular!)
❌ crud → accounting → crud (circular!)
```

**Resolution**: Extract shared logic to lower layer or redesign interfaces.

---

### Rule 2: Layer Boundaries

**Policy**: Packages can only depend on packages in lower layers or the same
layer (with justification).

**Enforcement**:

- Automated check via `pnpm run validate:deps`
- PR review

**Violation Examples**:

```
❌ canon → crud (Layer 1 → Layer 3)
❌ database → workflow (Layer 1 → Layer 2)
❌ accounting → crud (Layer 2 → Layer 3)
```

**Resolution**: Move logic to correct layer or use dependency injection.

---

### Rule 3: Foundation Isolation

**Policy**: Foundation packages (Layer 1) MUST NOT depend on any workspace
packages except Layer 0.

**Enforcement**:

- Strict automated check
- Zero tolerance in PR reviews

**Rationale**: Foundation is the dependency root. If it depends on higher
layers, the entire architecture collapses.

**Allowed**:

```json
// packages/canon/package.json
{
   "dependencies": {
      "zod": "^3.22.0" // ✅ External
   }
}
```

**Forbidden**:

```json
// packages/canon/package.json
{
   "dependencies": {
      "afenda-workflow": "workspace:*" // ❌ Layer 2 dependency
   }
}
```

---

### Rule 4: Minimal Cross-Domain Dependencies

**Policy**: Domain services (Layer 2) should minimize dependencies on other
domain services.

**Guidance**:

- **Preferred**: Independent domain services orchestrated by CRUD
- **Acceptable**: Lightweight utility-style dependencies (e.g., `accounting` →
  `logger`)
- **Discouraged**: Heavy logic dependencies (e.g., `inventory` calling
  `accounting.calculateTax()`)
- **Forbidden**: Circular domain dependencies

**When cross-domain logic is needed**:

1. **Option A**: Orchestrate both services in CRUD handler
2. **Option B**: Extract shared logic to canon (if it's a type/schema)
3. **Option C**: Extract shared logic to new Layer 2 service (if substantial)
4. **Option D**: Document dependency with clear rationale (rare)

---

### Rule 5: Database Access Patterns

**Policy**: Direct Drizzle ORM usage is restricted.

**Allowed**:

- ✅ `database` package - Schema definitions and utilities
- ✅ Domain services - Read using `database` utilities (typed selects)
- ⚠️ `advisory` - Direct writes (documented exception for performance)
- ❌ CRUD - Should use `database` utilities, not raw Drizzle

**Rationale**: Centralizing database access in `database` package utilities
ensures:

- Type safety
- Query consistency
- Performance monitoring
- Migration safety

**Documented Exception**:

```typescript
// packages/advisory/src/writer.ts
import { advisories, db, eq } from 'afenda-database';

// Exception: Advisory writes directly for analytics performance
// Bypasses CRUD audit logging (advisories are system-generated)
await db.insert(advisories).values({ ... });
```

---

### Rule 6: Public API Boundaries

**Policy**: Packages MUST only import from other packages' `index.ts` exports.

**Violation Example**:

```typescript
// ❌ FORBIDDEN: Reaching into internal modules
import { internalHelper } from "afenda-crud/src/utils/internal-helper";

// ✅ ALLOWED: Using public API
import { mutate } from "afenda-crud";
```

**Enforcement**:

- ESLint rule (TBD)
- PR review
- Public APIs should be minimal and well-documented

**Rationale**: Enforcing public API boundaries allows internal refactoring
without breaking consumers.

---

## Enforcement

### Automated Checks

Run validation before committing:

```bash
pnpm run validate:deps
```

This checks:

- ✅ No circular dependencies
- ✅ Layer boundary rules
- ✅ Foundation isolation
- ✅ Public API usage (planned)

### Pull Request Review

All PRs MUST:

1. Pass `validate:deps` check
2. Update `GOVERNANCE.md` if adding new dependency patterns
3. Document exceptions with clear rationale
4. Update `ARCHITECTURE.md` if adding packages

### CI Pipeline

Add to `.github/workflows/ci.yml`:

```yaml
- name: Validate Dependencies
  run: pnpm run validate:deps
```

---

## Exception Process

### When to Request an Exception

Exceptions to governance rules should be **rare** and **well-justified**. Valid
reasons:

1. **Performance** - Critical path requires optimization (e.g., advisory direct
   DB writes)
2. **External Constraints** - Third-party library forces specific architecture
3. **Temporary** - Refactoring in progress, exception is time-bound

### How to Request an Exception

1. **Document in Code**:
   ```typescript
   // GOVERNANCE EXCEPTION: [Rule X]
   // Rationale: [Clear explanation]
   // Approved: [Date] by [Person/Team]
   // Review: [Date to revisit]
   ```

2. **Update GOVERNANCE.md**:
   - Add to "Documented Exceptions" section
   - Link to code location
   - Specify review date

3. **PR Review**:
   - Tag architecture owner
   - Require explicit approval
   - Document in PR description

### Current Exceptions

1. **Advisory Database Access**
   - **Rule**: Domain services should use CRUD for writes
   - **Exception**: Advisory writes directly to database
   - **Rationale**: Performance (high-volume analytics), system-generated data
     (no audit needed)
   - **Location**: `packages/advisory/src/writer.ts`
   - **Approved**: 2026-02-17
   - **Review**: 2026-08-17 (6 months)

---

## Package Lifecycle

### Creating a New Package

1. **Justify the Need**:
   - Does it have 5+ related services?
   - Is the domain cohesive and well-bounded?
   - Can't it be added to existing package?

2. **Determine Layer**:
   - Configuration? → Layer 0
   - Core primitive/schema? → Layer 1
   - Domain logic? → Layer 2
   - Orchestration? → Layer 3 (rare - we have CRUD)

3. **Set Up Package**:
   ```bash
   mkdir -p packages/new-package/src
   cd packages/new-package
   ```

4. **Create Files**:
   - `package.json` (from template)
   - `tsconfig.json` (extends workspace)
   - `src/index.ts` (public exports)
   - `README.md` (from template)
   - `vitest.config.ts` (if tests)

5. **Declare Dependencies**:
   - Only add what you need
   - Follow layer rules
   - Document any exceptions

6. **Update Documentation**:
   - Add to `ARCHITECTURE.md`
   - Add to dependency graph
   - Update `pnpm-workspace.yaml` (if needed)

### Deprecating a Package

1. **Mark as Deprecated**:
   ```json
   // package.json
   {
      "deprecated": "Merged into afenda-accounting. Use that instead.",
      "version": "0.1.0"
   }
   ```

2. **Migration Path**:
   - Document in README
   - Provide codemod if possible
   - Set sunset date

3. **Removal**:
   - After 2 versions or 6 months
   - Requires architecture team approval

---

## Dependency Matrix

| Package             | Layer | Allowed Dependencies  |
| ------------------- | ----- | --------------------- |
| `eslint-config`     | 0     | External only         |
| `typescript-config` | 0     | External only         |
| `canon`             | 1     | Layer 0 + external    |
| `database`          | 1     | Layer 0 + external    |
| `logger`            | 1     | Layer 0 + external    |
| `ui`                | 1     | Layer 0 + external    |
| `workflow`          | 2     | Layer 0, 1 + external |
| `advisory`          | 2     | Layer 0, 1 + external |
| `search`            | 2     | Layer 0, 1 + external |
| `migration`         | 2     | Layer 0, 1 + external |
| `accounting`        | 2     | Layer 0, 1 + external |
| `inventory`         | 2     | Layer 0, 1 + external |
| `crm`               | 2     | Layer 0, 1 + external |
| `intercompany`      | 2     | Layer 0, 1 + external |
| `crud`              | 3     | All layers            |

---

## Review Schedule

- **Quarterly**: Review all documented exceptions
- **Per Release**: Update dependency graph
- **Annually**: Review layer structure for emerging patterns

---

## Questions?

For architecture decisions or exception requests:

1. Review this document and `ARCHITECTURE.md`
2. Check existing patterns in codebase
3. Discuss with team in PR
4. Update documentation with decision

---

**Last Updated**: February 17, 2026
