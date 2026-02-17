# AFENDA-NEXUS Agent Resources Index

Quick reference guide to all agent resources in this workspace.

**Last Updated:** February 17, 2026  
**Total Skills:** 11

---

## Quick Navigation

| Category | Skills |
|----------|--------|
| **??? Architecture & Structure** | [afenda-architecture](#afenda-architecture) � [package-development](#package-development) � [afenda-database-patterns](#afenda-database-patterns) |
| **?? Development Tools** | [afenda-cli-usage](#afenda-cli-usage) � [lint-types-debug](#lint-types-debug) |
| **?? Testing & Quality** | [vitest-testing](#vitest-testing) � [monorepo-testing-strategy](#monorepo-testing-strategy) |
| **??? Database & Infrastructure** | [neon-postgres](#neon-postgres) |
| **?? Domain Design** | [domain-driven-patterns](#domain-driven-patterns) |
| **?? Operations** | [ci-cd-pipeline](#ci-cd-pipeline) � [example-deployment](#example-deployment) |

---

## Skills by Category

### ??? Architecture & Structure

#### @afenda-architecture ???
**AFENDA-NEXUS monorepo architecture, layered dependencies, and package structure**

**Use when:**
- Creating new packages
- Understanding layer dependencies
- Navigating the monorepo structure
- Preventing circular dependencies
- Planning package placement

**Key Topics:**
- 4-layer architecture (Layer 0-3)
- Dependency flow rules (bottom-up only)
- Package creation guidelines
- Circular dependency prevention
- When to split packages

**Quick Reference:**
- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [packages/GOVERNANCE.md](../packages/GOVERNANCE.md)

**File:** [skills/afenda-architecture/SKILL.md](./skills/afenda-architecture/SKILL.md) (11KB)

---

#### @package-development ??
**Creating, structuring, and maintaining packages in the AFENDA-NEXUS monorepo**

**Use when:**
- Creating new packages
- Setting up package exports
- Configuring package builds
- Writing package documentation
- Following package templates

**Key Topics:**
- Package structure templates (by layer)
- Required files (package.json, tsconfig, README)
- Export patterns (barrel exports, public API)
- Testing setup per layer
- Build configuration
- Documentation requirements

**Quick Reference:**
- [packages/PACKAGE_TEMPLATE.md](../packages/PACKAGE_TEMPLATE.md)
- [packages/GOVERNANCE.md](../packages/GOVERNANCE.md)

**File:** [skills/package-development/SKILL.md](./skills/package-development/SKILL.md) (20KB)

---

#### @afenda-database-patterns ??
**Database schema patterns, migrations, RLS, and Drizzle ORM usage**

**Use when:**
- Creating database migrations
- Implementing Row-Level Security (RLS)
- Designing schema with composite PKs
- Working with Drizzle ORM
- Understanding multi-tenancy patterns

**Key Topics:**
- Migration file structure
- RLS policy patterns
- Drizzle schema conventions
- Composite primary keys
- FK constraint patterns
- Common migration operations

**Quick Reference:**
- [packages/database/src/migrations/](../packages/database/src/migrations/)
- [packages/database/src/schema/](../packages/database/src/schema/)

**File:** [skills/afenda-database-patterns/SKILL.md](./skills/afenda-database-patterns/SKILL.md) (17KB)

---

### ?? Development Tools

#### @afenda-cli-usage ???
**afenda CLI tool usage for code generation, validation, and monorepo management**

**Use when:**
- Generating code with CLI
- Running meta commands
- Using adapter pipeline
- Validating dependencies
- Managing monorepo operations

**Key Topics:**
- Core commands (`afenda meta`, `housekeeping`, `bundle`)
- Adapter pipeline (`emit-all`, `handler-emit`, `bff-emit`)
- Validation commands (`schema-validate`, `type-check:refs`)
- Common workflows
- Troubleshooting CLI issues

**Quick Commands:**
```bash
pnpm afenda meta list                        # List all entities
pnpm afenda meta gen capability-map          # Generate capability map
pnpm afenda housekeeping validate-deps       # Check circular dependencies
pnpm afenda bundle check-exports             # Validate package exports
```

**File:** [skills/afenda-cli-usage/SKILL.md](./skills/afenda-cli-usage/SKILL.md) (12KB)

---

#### @lint-types-debug ??? (Enhanced with Official Docs)
**Diagnose and fix ESLint and TypeScript errors with official flat config and strict mode patterns**

**Use when:**
- Lint or type-check fails
- Debugging TypeScript strict mode errors
- ESLint reports violations
- Working with Turbo pipeline dependency issues
- Configuring ESLint flat config
- Setting up TypeScript project references

**Key Topics:**
- ESLint flat config format & ordering (official patterns)
- TypeScript-ESLint type-aware linting with `projectService`
- Official tsconfig.json recommended settings
- Common error patterns & fixes
- Flat config object schema
- Migration guides and troubleshooting

**Quick Commands:**
```bash
pnpm run lint                    # Lint all packages
pnpm run type-check              # Fast type check
pnpm run type-check:refs         # Full ref validation
pnpm run lint:fix                # Auto-fix issues
pnpm eslint --print-config file  # Debug config
```

**Official Sources:**
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [TypeScript-ESLint](https://typescript-eslint.io/getting-started/)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)

**File:** [skills/lint-types-debug/SKILL.md](./skills/lint-types-debug/SKILL.md) (23KB)

---

### ?? Testing & Quality

#### @vitest-testing ??? (Enhanced with Official Docs)
**Comprehensive Vitest 3.2+ testing guide with official projects configuration**

**Use when:**
- Writing unit or integration tests
- Setting up test coverage
- Using MCP for AI-powered testing
- Testing with database transactions
- Configuring Vitest projects mode
- Understanding coverage thresholds

**Key Topics:**
- Vitest 3.2+ projects configuration (official patterns)
- Official `defineConfig` and `defineProject` helpers
- Coverage thresholds (per-file, global, negative numbers)
- Pool modes comparison (threads vs forks)
- Unit vs integration test patterns
- MCP integration for AI testing
- CI/CD integration

**Quick Commands:**
```bash
pnpm test                        # Run all tests
pnpm test:coverage               # With coverage
pnpm test --ui                   # Interactive UI
pnpm --filter pkg test           # Package-specific
```

**Official Sources:**
- [Vitest Documentation](https://vitest.dev/guide/)
- [Projects Guide](https://vitest.dev/guide/workspace)
- [Coverage Configuration](https://vitest.dev/config/#coverage)

**File:** [skills/vitest-testing/SKILL.md](./skills/vitest-testing/SKILL.md) (27KB)

---

#### @monorepo-testing-strategy ?
**Testing strategy across the monorepo (unit, integration, E2E)**

**Use when:**
- Planning test strategy
- Understanding test organization
- Setting up new package tests
- Running different test types
- Analyzing coverage across monorepo

**Key Topics:**
- Unit test patterns (per package)
- Integration test patterns (database transactions)
- E2E test patterns (Playwright)
- Coverage requirements (70-80% per package)
- Test organization conventions
- MCP usage for test generation

**Quick Reference:**
- [vitest.config.ts](../vitest.config.ts)
- [playwright.config.ts](../playwright.config.ts)

**File:** [skills/monorepo-testing-strategy/SKILL.md](./skills/monorepo-testing-strategy/SKILL.md) (18KB)

---

###??? Database & Infrastructure

#### @neon-postgres ?? (Enhanced with Official Docs)
**Neon Serverless Postgres with official connection pooling, RLS, and branching patterns**

**Use when:**
- Setting up Neon database
- Configuring connection pooling (PgBouncer)
- Implementing Row-Level Security (RLS)
- Working with Neon branching
- Choosing connection methods
- Using Neon CLI or Platform API

**Key Topics:**
- PgBouncer connection pooling (10K max connections, transaction mode)
- Role-based access control (readonly/readwrite/developer)
- Row-Level Security setup with multi-tenant examples
- Database branching workflows (Time Travel, schema diff, CI/CD)
- AFENDA-NEXUS specific patterns (composite PKs, org isolation)
- Neon Auth, Drizzle integration, Platform API

**Official Sources:**
- [Neon Documentation](https://neon.com/docs/introduction)
- [Connection Pooling Guide](https://neon.com/docs/connect/connection-pooling)
- [Database Access & RLS](https://neon.com/docs/manage/database-access)
- [Branching Guide](https://neon.com/docs/guides/branching-intro)

**References:** 28+ detailed documentation files in [skills/neon-postgres/references/](./skills/neon-postgres/references/)

**File:** [skills/neon-postgres/SKILL.md](./skills/neon-postgres/SKILL.md) (18KB)

---

### ?? Domain Design

#### @domain-driven-patterns ?
**Domain-driven design patterns used in AFENDA-NEXUS domain packages**

**Use when:**
- Creating domain packages
- Implementing domain services
- Designing business logic
- Understanding domain patterns
- Working with ports and policies

**Key Topics:**
- Service pattern (business logic)
- Policy pattern (class + ports)
- Port pattern (interfaces, no I prefix)
- Value object pattern (immutable, static create)
- Repository pattern
- Domain event pattern

**Quick Reference:**
- Domain packages: accounting, inventory, crm, procurement
- Service implementations
- Policy examples

**File:** [skills/domain-driven-patterns/SKILL.md](./skills/domain-driven-patterns/SKILL.md) (20KB)

---

### ?? Operations

#### @ci-cd-pipeline ?
**GitHub Actions CI/CD pipeline, security scanning, and deployment**

**Use when:**
- Understanding CI/CD workflows
- Setting up security scanning
- Configuring Renovate
- Deploying to Vercel
- Analyzing build failures
- Managing pipeline performance

**Key Topics:**
- GitHub Actions workflows
- Lint and type-check in CI
- Test execution (unit + E2E)
- Security audit and SBOM generation
- Renovate configuration
- Deployment to Vercel
- Pipeline optimization

**Quick Reference:**
- [.github/workflows/](../.github/workflows/)
- [renovate.json5](../renovate.json5)

**File:** [skills/ci-cd-pipeline/SKILL.md](./skills/ci-cd-pipeline/SKILL.md) (15KB)

---

#### @example-deployment
**Example skill showing deployment workflows with safety checks**

**Use when:**
- Planning production deployments
- Setting up deployment checklists
- Creating rollback procedures
- Understanding deployment best practices

**File:** [skills/example-deployment/SKILL.md](./skills/example-deployment/SKILL.md) (2KB)

---

## Context Files

Reference materials and completed work:

| File | Description | Status |
|------|-------------|--------|
| [PROJECTS_DOMAIN_COMPLETE.md](./context/PROJECTS_DOMAIN_COMPLETE.md) | Projects domain adoption complete | 13/14 entities (93%) |
| [SETUP_DOMAIN_COMPLETE.md](./context/SETUP_DOMAIN_COMPLETE.md) | Setup domain adoption complete | 27/27 entities (100%) |
| [capability-map.md](./context/capability-map.md) | Auto-generated system capability map | Regenerate as needed |

---

## Rules

Project-specific conventions:

| Rule | Description | File |
|------|-------------|------|
| **neon-drizzle** | Neon/Drizzle usage patterns | [neon-drizzle.mdc](./rules/neon-drizzle.mdc) |
| **vitest-mcp** | Vitest and MCP integration | [vitest-mcp.mdc](./rules/vitest-mcp.mdc) |

---

## How to Use This Index

1. **Find a skill** - Use category navigation or search for keywords
2. **Read the skill** - Click the file link to view full documentation
3. **Apply the pattern** - Follow examples and best practices
4. **Update when needed** - Keep skills current with architecture changes

---

## Skill Priorities

??? **Critical** - Core development, must-know for all developers  
?? **Important** - Specialized knowledge, needed for specific tasks  
? **Useful** - Reference material, domain-specific guidance

---

## Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) - Monorepo architecture overview
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [packages/GOVERNANCE.md](../packages/GOVERNANCE.md) - Package governance rules
- [packages/PACKAGE_TEMPLATE.md](../packages/PACKAGE_TEMPLATE.md) - Package creation template

---

**Maintained by:** AFENDA-NEXUS Team  
**Last Major Update:** February 17, 2026 (Added 7 Priority 1 skills, enhanced 3 existing skills with official docs)
