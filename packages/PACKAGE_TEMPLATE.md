# Package Template

Use this template when creating package READMEs. Replace all `[PLACEHOLDERS]` with actual content.

---

# [Package Name]

[One-line description of what this package does]

## Purpose

[2-3 paragraphs explaining the package's responsibility and role in the system]

## When to Use This Package

Use `[package-name]` when you need to:

- [Use case 1]
- [Use case 2]
- [Use case 3]
- [Use case 4]

**[Any usage warnings or restrictions]**

## Configuration

This package follows AFENDA NEXUS monorepo configuration standards for consistency and maintainability.

### TypeScript Configuration

```json
// tsconfig.json
{
  "extends": "afenda-typescript-config/[base|nextjs|react-library].json",
  "compilerOptions": {
    // Package-specific overrides only
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "**/*.test.*", "**/*.spec.*"]
}
```

**Configuration Inheritance:**

- `base.json` - Standard packages (most common)
- `react-library.json` - React component libraries
- `nextjs.json` - Next.js applications only

**Key Principles:**

- ✅ Extend shared presets to inherit common settings
- ✅ Minimize overrides - rely on preset defaults
- ✅ Use `tsBuildInfoFile` for incremental compilation
- ❌ Don't duplicate settings already in presets
- ❌ Avoid package-specific compiler options unless required

### Package.json Structure

```json
{
  "name": "afenda-[package-name]",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --cache --concurrency=auto",
    "lint:ci": "eslint . --ext .js,.jsx,.ts,.tsx --rule 'import/no-cycle: error'",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --cache --fix"
  },
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "afenda-eslint-config": "workspace:^",
    "afenda-typescript-config": "workspace:*",
    "typescript": "catalog:"
  }
}
```

**Configuration Standards:**

- **Naming:** All packages use `afenda-` prefix
- **Version:** Start at `0.1.0` for new packages
- **Type:** Use `"type": "module"` for ESM
- **Workspace Dependencies:** Use `workspace:*` protocol
- **Catalog Dependencies:** Use `catalog:` for versions managed in root
- **Scripts:** Follow standardized naming (see below)

### Standard Scripts

All packages should implement these scripts consistently:

```json
{
  "scripts": {
    // Type checking (required)
    "type-check": "tsc --noEmit",

    // Linting (required)
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --cache --concurrency=auto",
    "lint:ci": "eslint . --ext .js,.jsx,.ts,.tsx --rule 'import/no-cycle: error'",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --cache --fix",

    // Building (if package builds artifacts)
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",

    // Testing (if package has tests)
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

### Configuration File Checklist

Every package should have:

- ✅ `package.json` - Package manifest with standard scripts
- ✅ `tsconfig.json` - TypeScript config extending shared presets
- ✅ `src/index.ts` - Main entry point with exports
- ✅ `README.md` - Package documentation (this template)
- ⚠️ `.eslintrc.js` - Only if package-specific rules needed (rare)
- ⚠️ `.prettierrc` - Only if package-specific formatting needed (rare)

**Prefer inheritance over duplication:**

- ESLint config inherited from `afenda-eslint-config`
- TypeScript config inherited from `afenda-typescript-config`
- Prettier config inherited from root `.prettierrc.mjs`

### Validation Commands

```bash
# Validate TypeScript configuration
pnpm type-check

# Validate code style
pnpm lint

# Check for circular dependencies
pnpm lint:ci

# Run all checks
pnpm type-check && pnpm lint && pnpm test
```

## Key Concepts

### [Concept 1]

- **[Sub-concept]**: [Explanation]
- **[Sub-concept]**: [Explanation]
- **[Sub-concept]**: [Explanation]

### [Concept 2]

- **[Sub-concept]**: [Explanation]
- **[Sub-concept]**: [Explanation]

### [Concept 3]

[Explanation of important concept]

## Dependencies

- `[dependency-1]`: [Why this dependency]
- `[dependency-2]`: [Why this dependency]

**Dependency Rules:**

- Follow [GOVERNANCE.md](GOVERNANCE.md) layer restrictions
- Use workspace protocol for internal packages: `workspace:*`
- Use catalog for common external packages: `catalog:`
- Minimize external dependencies to reduce bundle size and security surface

## Public API

```typescript
import {
  [exportedFunction1],
  [exportedFunction2],
  type [ExportedType1],
  type [ExportedType2],
} from '[package-name]';
```

### [Function Category]

#### `[functionName](params): ReturnType`

[Function description]

**Parameters:**

- `param1` - [Description]
- `param2` - [Description]

**Returns:** [Description]

**Example:**

```typescript
const result = await functionName(db, orgId, {
  field1: 'value',
  field2: 123,
});
```

## Usage Examples

### [Example Scenario 1]

```typescript
import { [functions] } from '[package-name]';

// [Step-by-step example]
const result = await someFunction(params);
```

### [Example Scenario 2]

```typescript
// [Another practical example]
```

## Architecture

[Any important architectural notes, patterns used, or design decisions]

## Testing

[Testing strategy, examples, or requirements]

```bash
pnpm test
```

## Maintenance

### Configuration Updates

When monorepo configuration changes:

1. **TypeScript Updates:** Automatically inherited from shared presets
2. **Script Updates:** Update package.json scripts to match standards
3. **Dependency Updates:** Use Renovate or `pnpm update`

### Validation Workflow

```bash
# Check configuration health
pnpm type-check          # TypeScript errors
pnpm lint               # Code quality issues
pnpm test               # Tests passing

# From root - check all packages
pnpm -r type-check      # All packages
turbo run lint          # With caching
```

### Common Issues

**"Cannot find module 'afenda-typescript-config'"**

- Run `pnpm install` from root to link workspace dependencies

**"Module ... has already exported a member named ..."**

- Check for duplicate exports in barrel files
- Review import/export structure

**Circular dependency warnings during lint:ci**

- Review cross-package imports
- Consider extracting shared code to Layer 1
- See [GOVERNANCE.md](GOVERNANCE.md) for dependency rules

---

**See Also:**

- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [GOVERNANCE.md](GOVERNANCE.md) - Dependency rules and layer restrictions
- [CODING_STANDARDS.md](../docs/CODING_STANDARDS.md) - Code conventions
- [CONFIG-SYNC-REPORT.md](../docs/CONFIG-SYNC-REPORT.md) - Configuration synchronization details
