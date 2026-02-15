# Afena CLI & Meta Engine — Architecture Reference

> **Auto-generated** by `afena readme gen` at 2026-02-14T09:51:23Z. Do not edit — regenerate instead.
> **Package:** `@afena/cli` (`tools/afena-cli`)
> **Purpose:** Capability Truth Ledger — scan, check, generate, fix. README generation. Entity scaffolding.

---

## 1. Architecture Overview

The CLI provides three command groups: `meta` (capability governance), `readme` (documentation),
and entity generation. The meta engine scans the codebase for capability annotations, runs
5 visibility checks (VIS-00 through VIS-04), and generates a capability ledger, coverage matrix,
Mermaid diagrams, and AI context documents.

Architecture documents are auto-generated from live codebase introspection during `readme gen`.

---

## 2. Key Design Decisions

- **VIS-00**: No state mutation without a capability key (write boundary detection)
- **VIS-01**: Every mutation capability maps to ACTION_TYPES + HANDLER_REGISTRY
- **VIS-02**: Phase-aware surface coverage (kind-dependent severity)
- **VIS-03**: UI surfaces must not expose undeclared capabilities
- **VIS-04**: Active capabilities must be observed in at least one surface
- **L1 scanner**: Regex-based (fast) for CAPABILITIES + SURFACE consts
- **L2 scanner**: AST-based (`--deep` flag) for @capability JSDoc tags
- **Exception system**: JSON file with expiry dates + review cycles

---

## 3. Package Structure (live)

| Metric | Value |
| ------ | ----- |
| **Source files** | 44 |
| **Test files** | 1 |
| **Source directories** | executor, generator, meta, scanner, types, utils |

```
tools/afena-cli/src/
├── executor/
├── generator/
├── meta/
├── scanner/
├── types/
├── utils/
```

---

## 4. Dependencies

### Internal (workspace)

- `afena-canon`
- `afena-typescript-config`
- `afena-vitest-config`

### External

| Package | Version |
| ------- | ------- |
| `commander` | `catalog:` |
| `cosmiconfig` | `catalog:` |
| `execa` | `catalog:` |
| `fast-glob` | `catalog:` |
| `listr2` | `catalog:` |
| `picocolors` | `catalog:` |
| `semver` | `catalog:` |
| `strip-ansi` | `catalog:` |
| `zod` | `catalog:` |

---

## 5. Database Tables

- `table_name`

---

## 6. Invariants

- `INVARIANT-01`
- `INVARIANT-P01`
- `INVARIANT-P02`
- `INVARIANT-P03`
- `INVARIANT-RO`
- `INVARIANT_REGEX`
- `K-01`
- `K-02`
- `K-03`
- `K-04`
- `K-05`
- `K-06`
- `K-11`
- `K-13`
- `TERM-01`
- `VIS-00`
- `VIS-01`
- `VIS-02`
- `VIS-03`
- `VIS-04`

---

## Design Patterns Detected

- **Chain of Responsibility**
- **Observer**
- **Registry**

---

## Cross-References

- [`crud.architecture.md`](./crud.architecture.md)
