# AFENDA-NEXUS Agent Resources

This directory contains AI agent resources, skills, rules, and contextual information for working with the AFENDA-NEXUS monorepo.

**Last Updated:** February 21, 2026  
**Total Skills:** 29 (18 from skills.sh + 11 custom project skills)  
**Organization:** Single unified directory - no duplicate folders ✨

---

## Directory Structure

```
.agents/                             # Main agent directory (unified)
├── README.md                        # This file - Overview of agent resources
├── INDEX.md                         # Quick reference index of all resources
│
├── context/                         # Reference materials
│   └── capability-map.md            # System capability mapping
│
├── rules/                           # Project-specific conventions
│   ├── neon-drizzle.mdc             # Neon/Drizzle usage patterns
│   └── vitest-mcp.mdc               # Vitest MCP integration
│
└── skills/                          # AI agent skills (29 total)
    ├── INSTALLED-SKILLS.md          # Complete skill reference documentation
    ├── SKILL-TEMPLATE.md            # Template for new skills
    │
    ├── ─── From skills.sh (18 skills) ───
    ├── accessibility/               # ★★★ WCAG compliance & a11y patterns
    ├── claw-release/                # ★★ Release automation (ClawSec)
    ├── clawsec-clawhub-checker/     # ★★ ClawHub security verification
    ├── clawsec-feed/                # ★★ Security feed monitoring
    ├── clawsec-suite/               # ★★★ Comprehensive security suite
    ├── clawtributor/                # ★★ Contribution security
    ├── drizzle/                     # ★★★ Drizzle ORM documentation
    ├── form-builder/                # ★★ React Hook Form + Zod
    ├── monorepo-management/         # ★★★ Turborepo, Nx, pnpm
    ├── next-best-practices/         # ★★★ Vercel Next.js patterns
    ├── nextjs-16-complete-guide/    # ★★★ Next.js 16 migration
    ├── openclaw-audit-watchdog/     # ★★ Security audits (ClawSec)
    ├── optimized-nextjs-typescript/ # ★★★ TypeScript + Next.js
    ├── pnpm/                        # ★★★ pnpm workspace management
    ├── prompt-agent/                # ★★ Prompt security (ClawSec)
    ├── shadcn-ui/                   # ★★★ shadcn/ui components
    ├── soul-guardian/               # ★★ SOUL.md drift detection
    ├── zod/                         # ★★★ Zod validation library
    │
    └── ─── Custom Project Skills (11 skills) ───
        ├── afenda-architecture/     # ★★★ Monorepo architecture
        ├── afenda-cli-usage/        # ★★★ CLI commands & workflows
        ├── afenda-database-patterns/# ★★ DB schema & migrations
        ├── ci-cd-pipeline/          # ★★ CI/CD workflows
        ├── domain-driven-patterns/  # ★★ DDD patterns
        ├── example-deployment/      # ★ Example deployment workflow
        ├── lint-types-debug/        # ★★★ ESLint 9+ flat config
        ├── monorepo-testing-strategy/# ★★ Testing strategy
        ├── neon-postgres/           # ★★★ Neon Postgres integration
        ├── package-development/     # ★★★ Package creation guide
        └── vitest-testing/          # ★★★ Vitest 4.0 testing patterns
```

**Legend:**

- ★★★ High Priority - Critical for daily development
- ★★ Medium Priority - Important for specific tasks
- ★ Low Priority - Reference or examples

---

## What''s Included

### ?? Skills (11 total)

Reusable knowledge modules that guide AI assistants through specific workflows.

#### ??? **Architecture & Structure (3 skills)**

- **afenda-architecture** ??? - Monorepo architecture, layered dependencies, package structure
- **package-development** ?? - Creating and maintaining packages in the monorepo
- **afenda-database-patterns** ?? - Database schema patterns, migrations, RLS, Drizzle ORM

#### ?? **Development Tools (2 skills)**

- **afenda-cli-usage** ??? - CLI tool usage for code generation and validation
- **lint-types-debug** ??? - ESLint & TypeScript debugging with official patterns

#### ?? **Testing & Quality (2 skills)**

- **vitest-testing** ??? - Vitest 3.2+ testing with official projects configuration
- **monorepo-testing-strategy** ? - Testing strategy across unit/integration/E2E

#### ??? **Database & Infrastructure (1 skill)**

- **neon-postgres** ?? - Neon Serverless Postgres with official connection pooling & RLS

#### ?? **Domain Design (1 skill)**

- **domain-driven-patterns** ? - Domain-driven design patterns for domain packages

#### ?? **Operations (2 skills)**

- **ci-cd-pipeline** ? - GitHub Actions CI/CD, security scanning, deployment
- **example-deployment** - Example deployment workflow template

---

### ?? Context

Reference materials:

- **capability-map.md** - Auto-generated system capability map (regenerate with `pnpm afenda meta gen capability-map`)

---

### ?? Rules

Project-specific conventions and rules:

- **neon-drizzle.mdc** - Neon/Drizzle usage patterns (database access, migrations, RLS)
- **vitest-mcp.mdc** - Vitest and MCP integration rules (AI-powered testing)

---

## Recent Updates (February 2026)

### ? Phase 1: Cleanup Complete

- Removed 3 legacy plans (axis-erp/ERPNext references)
- Removed 1 legacy rule (axis-erp-test-location)
- Archived outdated content to ARCHIVE/
- Updated directory structure

### ? Phase 2: Priority 1 Skills Created (7 new skills, ~4,700 lines)

1. **afenda-architecture** - Monorepo architecture & layered dependencies
2. **afenda-cli-usage** - CLI commands & code generation workflows
3. **afenda-database-patterns** - Database schema patterns & migrations
4. **package-development** - Package creation & maintenance guide
5. **domain-driven-patterns** - DDD patterns for domain packages
6. **monorepo-testing-strategy** - Testing strategy across monorepo
7. **ci-cd-pipeline** - GitHub Actions workflows & security scanning

### ? Phase 3: Existing Skills Enhanced (3 skills, ~67KB total)

- **lint-types-debug** - Added official ESLint flat config & TypeScript-ESLint patterns
- **neon-postgres** - Added official connection pooling, RLS, and branching workflows
- **vitest-testing** - Added official Vitest 3.2+ projects configuration & coverage patterns

**Enhancement Sources:**

- [ESLint.org](https://eslint.org/docs/latest/) - Flat config format, plugin system
- [TypeScript-ESLint](https://typescript-eslint.io/) - Type-aware linting, projectService
- [Neon Docs](https://neon.com/docs/introduction) - Connection pooling, RLS, branching
- [Vitest.dev](https://vitest.dev/guide/) - Projects mode, coverage configuration

---

## How to Use

### For AI Agents

Skills are designed to be referenced by AI assistants using the `@skill-name` syntax:

```
@afenda-architecture - Understanding monorepo structure
@afenda-cli-usage - Running CLI commands
@lint-types-debug - Fixing ESLint/TypeScript errors
@vitest-testing - Writing and running tests
@neon-postgres - Working with Neon database
```

### For Developers

1. **Browse INDEX.md** - Quick reference to all skills by category
2. **Read relevant skills** - Navigate to specific skill files for detailed guidance
3. **Follow patterns** - Apply best practices from skill examples
4. **Update skills** - Keep skills current as architecture evolves

### For New Team Members

Start with these core skills:

1. **@afenda-architecture** - Understand the monorepo structure
2. **@package-development** - Learn how to create packages
3. **@afenda-cli-usage** - Master the CLI tools
4. **@lint-types-debug** - Debug common errors
5. **@vitest-testing** - Write effective tests

---

## Skill Format

Each skill includes:

````markdown
```skill
---
name: skill-name
description: Brief description of what the skill covers
---

# Skill Title

Main content with:
- Quick commands tables
- Code examples
- Best practices
- Troubleshooting guides
- Official documentation links
```
````

```

---

## Maintenance

### When to Update Skills

- Architecture changes (new layer, dependency changes)
- CLI command additions or changes
- New database patterns emerge
- Testing strategy evolves
- Official documentation updates

### When to Add New Skills

- New major feature (e.g., async jobs, event sourcing)
- New tooling integration (e.g., GraphQL, WebSockets)
- Cross-cutting concerns emerge (e.g., caching, rate limiting)

### When to Archive Skills

- Technology replaced (e.g., migration from old tool)
- Patterns deprecated
- Content becomes legacy

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
- [.github/workflows/](../.github/workflows/) - CI/CD pipeline definitions

---

## Statistics

- **Total Skills:** 11
- **New Skills (Feb 2026):** 7 (Priority 1)
- **Enhanced Skills:** 3 (with official docs)
- **Total Documentation:** ~200KB across all skills
- **Context Files:** 1
- **Rules:** 2
- **Total Migrations:** 72 (database)
- **Entity Adoption:** 40/41 entities (98%)

---

**Maintained by:** AFENDA-NEXUS Team
**Questions?** See [INDEX.md](./INDEX.md) for detailed skill navigation
**Contributing:** Follow patterns in [SKILL-TEMPLATE.md](./skills/SKILL-TEMPLATE.md)
```
