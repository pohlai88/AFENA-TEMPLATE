# ADR-005: Shared Package Structure

**Status**: Accepted  
**Date**: 2025-11-20  
**Deciders**: Engineering Team  
**Technical Story**: Package organization and dependency management

## Context

In our monorepo, we needed clear guidelines for:
- When to create a new package vs. adding to existing package
- Package naming conventions
- Internal dependency structure
- Build and publish configuration
- Documentation standards

Without guidelines, we risk:
- Package proliferation (too many tiny packages)
- Unclear dependencies (circular dependencies)
- Inconsistent build configuration
- Difficult to navigate codebase

## Decision

We will follow a **domain-driven package structure** with clear rules for package creation and organization.

### Package Categories

1. **Core Infrastructure** (`packages/`)
   - `database` - Database schema, client, migrations
   - `logger` - Structured logging (Pino)
   - `observability` - OpenTelemetry, Sentry, health checks

2. **Domain Logic** (`packages/`)
   - `crud` - CRUD operations and utilities
   - `canon` - Validation schemas and types
   - `workflow` - Workflow engine
   - `advisory` - Advisory system
   - `migration` - Data migration utilities
   - `search` - Search functionality

3. **UI Components** (`packages/`)
   - `ui` - Shared React components (shadcn/ui)

4. **Tooling** (`tools/`)
   - `afena-cli` - CLI for metadata generation and housekeeping

5. **Applications** (`apps/`)
   - `web` - Next.js web application

### Package Creation Rules

#### When to Create a New Package

✅ **Create a new package when**:
- Functionality is reusable across multiple apps
- Domain logic is cohesive and self-contained
- Package has clear public API
- Package can be tested independently
- Package may be published to npm (future)

❌ **Don't create a package when**:
- Functionality is app-specific
- Package would have < 3 files
- Logic is tightly coupled to single app
- No clear boundary or API

### Package Structure Template

```
packages/<package-name>/
├── package.json          # Package metadata
├── tsconfig.json         # TypeScript config (extends base)
├── tsconfig.build.json   # Build-specific config
├── tsup.config.ts        # Build configuration (tsup)
├── vitest.config.ts      # Test configuration
├── eslint.config.js      # Linting rules
├── README.md             # Package documentation
├── src/
│   ├── index.ts          # Main exports
│   ├── <feature>.ts      # Implementation files
│   └── __tests__/
│       ├── unit/         # Unit tests
│       ├── integration/  # Integration tests
│       └── fixtures/     # Test data and mocks
└── dist/                 # Build output (gitignored)
    ├── index.js          # CommonJS
    ├── index.mjs         # ES Modules
    └── index.d.ts        # TypeScript declarations
```

### Naming Conventions

- **Package names**: `afenda-<domain>` (e.g., `afenda-logger`, `afenda-database`)
- **File names**: `kebab-case.ts` (e.g., `user-service.ts`)
- **Export names**: `camelCase` or `PascalCase` (e.g., `createUser`, `UserService`)

### Dependency Rules

1. **No circular dependencies**: `database` → `logger` ✅, `logger` → `database` ❌
2. **One-way flow**: Apps depend on packages, packages don't depend on apps
3. **Core packages are leaf nodes**: `logger` should have no internal dependencies
4. **Explicit dependencies**: Use `workspace:*` in `package.json`

### Dependency Hierarchy

```
Apps (web)
    ↓
Domain Packages (crud, workflow, advisory)
    ↓
Infrastructure Packages (database, logger, observability)
    ↓
External Dependencies (npm packages)
```

## Consequences

### Positive

✅ **Clear organization**: Easy to find code by domain  
✅ **Reusability**: Shared packages avoid duplication  
✅ **Independent testing**: Each package has its own tests  
✅ **Type safety**: TypeScript project references across packages  
✅ **Scalability**: Easy to add new packages as project grows  
✅ **Documentation**: Each package has its own README  

### Negative

⚠️ **Initial overhead**: More files/folders than monolithic app  
⚠️ **Build complexity**: Must build dependencies before dependents  
⚠️ **Versioning**: Internal version management (workspace protocol)  

### Neutral

ℹ️ **Migration path**: Can always consolidate packages if too granular  
ℹ️ **Publishing**: Packages structured for future npm publishing  

## Package Standards

### package.json Template

```json
{
  "name": "afenda-<domain>",
  "version": "0.1.0",
  "description": "Brief description",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "lint": "eslint . --ext .js,.ts --cache",
    "type-check": "tsc --noEmit"
  },
  "keywords": ["afenda", "<domain>"],
  "author": "afenda Team",
  "license": "MIT"
}
```

### README Template

```markdown
# @afenda/<package-name>

Brief description of package purpose.

## Installation

\`\`\`bash
pnpm add afenda-<package-name>
\`\`\`

## Usage

\`\`\`typescript
import { example } from 'afenda-<package-name>';
\`\`\`

## API

### `functionName(params)`

Description

## Development

\`\`\`bash
pnpm install
pnpm build
pnpm test
\`\`\`

## License

MIT
```

## Implementation Notes

### Build Configuration

All packages use `tsup` for bundling:
- **Output**: CommonJS, ES Modules, TypeScript declarations
- **Source maps**: Enabled for debugging
- **Tree-shaking**: Enabled via `treeshake: true`
- **Minification**: Disabled for readability

### Testing Standards

- **Unit tests**: `src/__tests__/unit/` (isolated, fast)
- **Integration tests**: `src/__tests__/integration/` (database, APIs)
- **Fixtures**: `src/__tests__/fixtures/` (test data, mocks)
- **Coverage threshold**: 80% lines, 80% functions, 75% branches

### Documentation

- **README**: Overview, installation, usage examples
- **JSDoc**: Public APIs have comprehensive documentation
- **Examples**: Real-world usage examples in README
- **CHANGELOG**: Track breaking changes (when publishing)

## Exceptions

Some packages may deviate from structure:
- **`eslint-config`**: Configuration-only, no `src/` directory
- **`typescript-config`**: Configuration-only, no `src/` directory
- **`afena-cli`**: CLI tool, may have different structure

## References

- [pnpm Workspace Protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Turborepo Package Dependencies](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks#defining-a-pipeline)
