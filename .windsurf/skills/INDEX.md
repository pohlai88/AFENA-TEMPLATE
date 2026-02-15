# Windsurf Skills Index

Quick reference guide to all available skills in this workspace.

## Available Skills

| Skill | Invoke With | Description |
|-------|-------------|-------------|
| **Lint & Type Debugging** | `@lint-types-debug` | Diagnose and fix ESLint and TypeScript errors in the AFENDA-NEXUS monorepo |
| **Vitest Testing** | `@vitest-testing` | Comprehensive Vitest testing guide with unit/integration tests, coverage, and MCP tooling |
| **Neon Postgres** | `@neon-postgres` | Guides and best practices for working with Neon Serverless Postgres |
| **Example Deployment** | `@example-deployment` | Example skill showing deployment workflows with safety checks |

## Skills by Category

### 🔧 Development & Debugging
- **`@lint-types-debug`** - ESLint and TypeScript error resolution
  - Quick commands for lint/type-check
  - Common error patterns and fixes
  - Package-specific notes and overrides
  - [View Skill](./lint-types-debug/SKILL.md) | [Reference](./lint-types-debug/reference.md) | [Compliance Report](./lint-types-debug/COMPLIANCE-REPORT.md)
- **`@vitest-testing`** - Vitest testing and coverage
  - Unit and integration test patterns
  - MCP integration for AI-powered testing
  - Coverage analysis and optimization
  - Real codebase examples
  - [View Skill](./vitest-testing/SKILL.md) | [Reference](./vitest-testing/reference.md) | [Examples](./vitest-testing/examples.md)


### 🗄️ Database & Infrastructure
- **`@neon-postgres`** - Neon Serverless Postgres reference
  - Connection methods and drivers
  - Neon Auth setup and configuration
  - Platform API and CLI usage
  - 28+ supporting reference documents
  - [View Skill](./neon-postgres/SKILL.md) | [All References](./neon-postgres/references/)

### 🚀 Deployment & Operations
- **`@example-deployment`** - Deployment workflow template
  - Pre-deployment checklist
  - Deployment steps and verification
  - Rollback procedures
  - [View Skill](./example-deployment/SKILL.md)

## How to Use Skills

### Automatic Invocation
Cascade automatically invokes skills when it detects tasks matching the skill's description.

#vitest-testing How do I write integration tests with database transactions?
```

```
@## Manual Invocation
Use `@<skill-name>` in your chat to explicitly invoke a skill:

```
@lint-types-debug I'm getting a TypeScript error about exactOptionalPropertyTypes
```

```
@neon-postgres How do I set up Neon Auth in Next.js?
```

```
@example-deployment Walk me through deploying to production
```

## Creating New Skills

1. **Use the template**: Copy `SKILL-TEMPLATE.md` to a new directory
2. **Follow the structure**: See existing skills for examples
3. **Add supporting docs**: Include reference materials as needed
4. **Update this index**: Add your new skill to the tables above

See [README.md](./README.md) for detailed instructions on creating skills.

## Skill Maintenance

- **Keep skills updated** as workflows evolve
- **Add supporting resources** for complex procedures
- **Document exceptions** and edge cases
- **Cross-reference** related skills

## Related Documentation

- [Windsurf Skills README](./README.md) - Complete guide to the skills system
- [Skill Template](./SKILL-TEMPLATE.md) - Template for creating new skills
- [Official Windsurf Docs](https://docs.windsurf.com/windsurf/cascade/skills) - Windsurf skills documentation
