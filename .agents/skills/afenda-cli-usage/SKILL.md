# afenda-cli-usage

## Description

Comprehensive guide to the `afenda` CLI tool: code generation, validation, monorepo management, and adapter pipeline workflows.

## Trigger Conditions

Use this skill when:

- Questions about CLI commands (`afenda` tool)
- Code generation tasks (entities, handlers, BFF)
- README generation or validation
- Metadata and capability ledger management
- Housekeeping and bundle operations
- Adapter pipeline workflows

---

## Overview

The `afenda` CLI is the unified command interface for the AFENDA-NEXUS monorepo. It provides 30+ commands for:

- **Code Generation**: Create entities, handlers, BFF endpoints
- **Validation**: Check dependencies, READMEs, metadata
- **Maintenance**: Bundle tasks, housekeeping, quality checks
- **Development**: Registry-based command routing

---

## Core Commands

### Environment Check

#### `pnpm afenda doctor`

Check environment setup and dependencies.

**Checks**:

- Node version (requires >=18)
- pnpm installed
- turbo installed
- git available
- Registry file exists
- Config file exists

**Example Output**:

```
afenda Doctor

  Node: v20.11.0 ✅
  pnpm: ✅
  turbo: ✅
  git: ✅
  Registry: ✅
  Config: ⚠️  .afendarc.json not found (using defaults)

  Environment variables:
    CI              — Disables ANSI colors (auto in CI)
    afenda_VERBOSE  — Enables debug logging
    AFENDA_TIMEOUT  — Override exec timeout in ms (default: 300000)
```

### Environment Variables

| Variable        | Purpose                                                  |
| --------------- | -------------------------------------------------------- |
| `CI`            | Disables ANSI colors when set (e.g. in CI pipelines)     |
| `afenda_VERBOSE`| Enables debug-level log output                           |
| `AFENDA_TIMEOUT`| Override default exec timeout in ms (default: 300000 / 5 min) |

---

## Meta Commands (Capability Truth Ledger)

### `pnpm afenda meta gen`

Scan codebase surfaces and generate capability ledger, matrix, manifest, and Mermaid diagrams.

**What it generates**:

- `.afenda/capability.ledger.json` - Complete capability inventory
- `.afenda/capability.matrix.md` - Capability implementation matrix
- `.afenda/codebase.manifest.json` - Package graph, schema catalog, LOC stats
- `.afenda/dependency.mmd` - Package dependency diagram
- `.afenda/capability.mmd` - Capability flow diagram
- `.afenda/ai-context.md` - AI-readable codebase summary

**Options**:

- `--deep` - Enable L2 AST scanning for `@capability` JSDoc tags

**When to use**:

- After adding new entities or capabilities
- Before generating AI context for agents
- After major refactoring

**Example**:

```bash
pnpm afenda meta gen --deep
```

---

### `pnpm afenda meta check`

Run VIS-00 through VIS-04 validation checks.

**Validation Checks**:

- **VIS-00**: Completeness (all catalog entries implemented)
- **VIS-01**: Kernel (CRUD operation signatures)
- **VIS-02**: Surface (capability surface consistency)
- **VIS-03**: UI Truth (UI surface alignment)
- **VIS-04**: Dead/Active (no unused implementations)

**Exit Codes**:

- `0` - All checks passed
- `1` - One or more checks failed

**When to use**:

- CI/CD pipelines
- Before committing major changes
- After adding new capabilities

**Example**:

```bash
pnpm afenda meta check
```

---

### `pnpm afenda meta matrix`

Generate and print capability implementation matrix only.

**Output**: Markdown table showing:

- Entity capabilities (CRUD operations)
- Implementation status per surface (CRUD, Handler, BFF, UI)
- Coverage statistics

**When to use**:

- Quick capability coverage overview
- Documentation updates

---

### `pnpm afenda meta fix`

Auto-fix missing `@capability` annotations in code.

**Options**:

- `--dry-run` - Preview changes without writing files

**When to use**:

- After `meta check` reports missing annotations
- Before generating ledger

**Example**:

```bash
pnpm afenda meta fix --dry-run
pnpm afenda meta fix
```

---

### `pnpm afenda meta manifest`

Generate codebase manifest only (package graph, schema catalog, stats).

**Output**: `.afenda/codebase.manifest.json`

**Contains**:

- Package dependency graph
- Database schema catalog
- Repository statistics (LOC, file counts)

---

## README Commands

### `pnpm afenda readme gen`

Generate missing READMEs and update stale ones.

**Options**:

- `--package <name>` - Target specific package by name
- `--dir <path>` - Target specific package by directory
- `--dry-run` - Preview output without writing files

**What it does**:

- Creates README.md for packages without one
- Updates `<!-- AUTOGEN:* -->` blocks in existing READMEs
- Generates sections: Overview, Installation, Usage, API, Testing, Contributing

**Example**:

```bash
# Generate for all packages
pnpm afenda readme gen

# Generate for specific package
pnpm afenda readme gen --package accounting

# Preview changes
pnpm afenda readme gen --dry-run
```

---

### `pnpm afenda readme sync`

Update autogen blocks in existing READMEs only (doesn't create new files).

**Options**:

- `--dry-run` - Preview output without writing files

**When to use**:

- After changing package exports
- After updating API signatures
- Regular maintenance

---

### `pnpm afenda readme check`

Validate READMEs against Definition of Done.

**Validation Criteria**:

- README.md exists
- Required sections present
- Autogen blocks up to date
- No broken internal links

**Exit Codes**:

- `0` - All READMEs valid
- `1` - One or more validation failures

**When to use**:

- CI/CD pipelines
- Before releases

---

## Bundle & Housekeeping

### `pnpm afenda bundle`

Run all maintenance tasks in one command (README, metadata, housekeeping).

**Steps**:

1. Generate/update READMEs
2. Run `meta gen`
3. Run `housekeeping` checks

**Options**:

- `--skip-readme` - Skip README generation
- `--skip-meta` - Skip metadata generation
- `--skip-housekeeping` - Skip housekeeping checks
- `--dry-run` - Preview changes without writing

**When to use**:

- Before commits
- CI/CD pipelines
- Regular maintenance

**Example**:

```bash
# Full bundle
pnpm bundle

# Skip README generation
pnpm bundle --skip-readme

# Dry run
pnpm bundle --dry-run
```

---

### `pnpm afenda housekeeping`

Run monorepo housekeeping checks.

**Checks**:

- Dependency consistency
- Package.json alignment
- Build configuration
- TypeScript project references

**Options**:

- `--json` - Output as JSON
- `--debug` - Enable debug output

**Exit Codes**:

- `0` - All checks passed
- `1` - One or more issues found

**Example**:

```bash
pnpm housekeeping
pnpm housekeeping --json > housekeeping-report.json
```

---

## Discovery & Registry

### `pnpm afenda discover`

Run discovery scanner to find and catalog scripts/commands.

**Options**:

- `--json` - Output as JSON
- `--since <ref>` - Only check changes since git ref

**What it scans**:

- package.json scripts
- Executable files in tools/
- Custom commands

**Output**: `.afenda/discovery.json`

---

### `pnpm afenda list`

Show all registered commands from `afenda.registry.json`.

**Output Format**:

```
Registered commands:

  types → npx tsx tools/afenda-cli/src/types/generator.ts
  types:check → tsc --noEmit
  docs → npx markdownlint **/*.md
  build → turbo run build
  build:web → turbo run build --filter=web
```

---

## Validation Commands

### `pnpm validate:deps`

Validate package dependencies against 4-layer architecture rules.

**Checks**:

- Layer isolation (no upward dependencies)
- Circular dependencies
- Forbidden cross-layer references

**Exit Codes**:

- `0` - All dependencies valid
- `1` - Violations found

**When to use**:

- After adding new dependencies
- CI/CD pipelines
- Before major refactoring

---

### `pnpm type-check:refs`

Type-check TypeScript project references.

**What it does**:

- Runs `tsc -b` to check composite project references
- Validates cross-package type consistency

**When to use**:

- After modifying package exports
- Before building
- CI/CD pipelines

---

## Tools Documentation

### `pnpm afenda tools-docs`

Auto-generate documentation for tools directory.

**Options**:

- `--format <type>` - Output format: `markdown` or `both` (default: `both`)

**Generates**:

- `tools/README.md` - Markdown documentation
- `tools/TOOLS.json` - JSON metadata (if format is `both`)

**When to use**:

- After adding new tools
- Documentation maintenance

---

## Dynamic Registry Commands

The afenda CLI supports dynamic commands registered in `afenda.registry.json`:

### `pnpm afenda types [subcommand]`

Type generation commands.

### `pnpm afenda docs [subcommand]`

Documentation commands.

### `pnpm afenda guard [subcommand]`

Guardrail checks (non-blocking).

### `pnpm afenda clean [subcommand]`

Cleanup commands.

### `pnpm afenda dev [app]`

Start development server(s).

**Example**:

```bash
pnpm afenda dev web      # Start web app
pnpm afenda types check  # Check type generation
pnpm afenda clean all    # Clean all build outputs
```

---

## Common Workflows

### 1. Add New Entity

```bash
# 1. Create entity type in canon
# 2. Create database schema
# 3. Add migration

# 4. Generate metadata
pnpm afenda meta gen

# 5. Validate
pnpm afenda meta check

# 6. Update READMEs
pnpm afenda readme gen
```

---

### 2. Pre-Commit Workflow

```bash
# Run full bundle (recommended)
pnpm bundle

# Or run individual steps:
pnpm validate:deps
pnpm type-check:refs
pnpm afenda meta check
pnpm afenda readme check
pnpm housekeeping
```

---

### 3. CI/CD Pipeline

```bash
# 1. Install dependencies
pnpm install

# 2. Validate architecture
pnpm validate:deps

# 3. Type check
pnpm type-check:refs

# 4. Lint
pnpm lint

# 5. Run tests
pnpm test

# 6. Housekeeping checks
pnpm ci:housekeeping

# 7. Meta validation
pnpm afenda meta check

# 8. README validation
pnpm afenda readme check

# 9. Build
pnpm build
```

---

### 4. Generate AI Context for Agent

```bash
# Generate comprehensive AI context
pnpm afenda meta gen --deep

# Output: .afenda/ai-context.md
# Contains: capability ledger, package graph, schema catalog, repository stats
```

---

### 5. Quick Health Check

```bash
pnpm afenda doctor
```

---

## Configuration Files

### `afenda.registry.json`

Command registry mapping command names to scripts.

**Location**: Repository root

**Schema**:

```json
{
  "commands": {
    "group": {
      "default": "command",
      "subcommands": {
        "sub": "command"
      }
    }
  }
}
```

---

### `.afendarc.json`

Configuration for afenda CLI.

**Location**: Repository root

**Schema**:

```json
{
  "readme": {
    "exclude": ["packages/excluded"],
    "templateVersion": "v2"
  }
}
```

---

## Output Files (`.afenda/`)

The CLI generates several files in `.afenda/` directory:

| File                     | Command    | Purpose                            |
| ------------------------ | ---------- | ---------------------------------- |
| `capability.ledger.json` | `meta gen` | Complete capability inventory      |
| `capability.matrix.md`   | `meta gen` | Implementation status matrix       |
| `codebase.manifest.json` | `meta gen` | Package graph, schema catalog      |
| `dependency.mmd`         | `meta gen` | Package dependency Mermaid diagram |
| `capability.mmd`         | `meta gen` | Capability flow Mermaid diagram    |
| `ai-context.md`          | `meta gen` | AI-readable codebase summary       |
| `discovery.json`         | `discover` | Discovered scripts/commands        |

---

## Troubleshooting

### `afenda command not found`

```bash
# Rebuild CLI
cd tools/afenda-cli
pnpm build
cd ../..

# Or use dev version
pnpm afenda:dev <command>
```

---

### `Registry not found`

```bash
# Initialize registry
pnpm afenda discover --json > afenda.registry.json
```

---

### `TypeScript errors in CLI`

```bash
# Rebuild with latest types
cd tools/afenda-cli
pnpm type-check
pnpm build
```

---

## Exit Codes

All afenda commands follow standard exit code conventions:

- `0` - Success
- `1` - Validation failure or error

Use in CI/CD:

```bash
if ! pnpm afenda meta check; then
  echo "Capability validation failed"
  exit 1
fi
```

---

## References

- [tools/afenda-cli/](../../../tools/afenda-cli/) - CLI source code
- [afenda.registry.json](../../../afenda.registry.json) - Command registry
- [.afendarc.json](../../../.afendarc.json) - CLI configuration
- [tools/GUIDE.md](../../../tools/GUIDE.md) - Tools directory guide
- [ARCHITECTURE.md](../../../ARCHITECTURE.md) - Monorepo architecture
