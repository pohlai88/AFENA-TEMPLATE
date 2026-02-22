# LiteMeta Core — Purity Contract

This directory contains **pure, deterministic functions** with **zero side effects**.

## Core Principles

### ✅ Allowed in Core

- **Pure functions**: Same input → same output, always
- **Node.js built-ins** (no IO): `crypto`, `util`, `path`
- **Type-only imports**: From any package
- **Sibling core modules**: Other files in `core/`
- **Zod**: Already in canon, used for validation

### ❌ Forbidden in Core

- **IO operations**: `fs`, `net`, `http`, `child_process`
- **Timers**: `setTimeout`, `setInterval`, `setImmediate`
- **Global state mutation**: Modifying globals, process.env writes
- **Side-effect dependencies**: Logging libs, metrics libs, caching libs
- **Non-deterministic operations**: `Math.random()`, `Date.now()`, `crypto.randomBytes()`

## Enforcement

1. **ESLint rule**: `no-restricted-imports` blocks forbidden modules
2. **CI gate**: Build fails if core imports forbidden modules
3. **Code review**: Mandatory review for all core changes
4. **Testing**: All core functions must have deterministic tests

## Architecture

Core functions are **building blocks** that:
- Accept inputs
- Perform pure computation
- Return outputs
- **Never** perform side effects

Runtime concerns (logging, metrics, caching, IO) belong in:
- `../cache/` — In-memory caching only
- `../hooks/` — Instrumentation callbacks
- `../adapters/` — Optional runtime integrations
- Application layer — Redis, Pino, OTel, etc.

## Examples

### ✅ Pure (Allowed)

```ts
// Deterministic parsing
export function parseAssetKey(key: string): ParsedAssetKey {
  const normalized = key.trim().toLowerCase();
  // ... pure string manipulation
  return { prefix, segments, valid, errors };
}

// Deterministic classification
export function classifyColumn(fieldName: string): Classification | null {
  for (const pattern of PII_PATTERNS) {
    if (pattern.fieldNamePattern.test(fieldName)) {
      return { classification: pattern.classification, confidence: pattern.confidence };
    }
  }
  return null;
}
```

### ❌ Impure (Forbidden)

```ts
// ❌ IO operation
export function parseAssetKeyFromFile(path: string): ParsedAssetKey {
  const key = fs.readFileSync(path, 'utf-8'); // FORBIDDEN
  return parseAssetKey(key);
}

// ❌ Non-deterministic
export function generateAssetKey(): string {
  return `db.rec.${Math.random()}`; // FORBIDDEN
}

// ❌ Side effect
export function parseAssetKeyWithLogging(key: string): ParsedAssetKey {
  console.log('Parsing:', key); // FORBIDDEN
  return parseAssetKey(key);
}
```

## Migration Guide

If you need side effects, use hooks:

```ts
// In core (pure)
export function parseAssetKey(key: string): ParsedAssetKey {
  const result = /* pure computation */;
  
  // Hook call (optional, no-op by default)
  hooks.onCallEnd?.('parseAssetKey', performance.now() - start, {
    inputLength: key.length,
    valid: result.valid,
  });
  
  return result;
}

// In application (wired)
import { setLifecycleHooks } from 'afena-canon/lite-meta/hooks';
import { logger } from './logger';

setLifecycleHooks({
  onCallEnd: (op, duration, meta) => {
    logger.debug({ op, duration, ...meta }, 'lite-meta call');
  },
});
```

## Invariants

All core functions must satisfy their documented invariants:

- **Asset Keys**: K1-K9 (round-trip, canonicalization, validation)
- **Alias Resolution**: A1-A4 (determinism, idempotence, opt-in fuzzy)
- **Lineage**: L0-L2 (edge validation, cycle detection, confidence)
- **Quality Rules**: Q1-Q3 (schema validation, deterministic scoring)
- **Classification**: C1-C2 (pattern matching, no over-classification)

See `../__tests__/invariants/` for property-based tests.

## Questions?

If unsure whether something belongs in core, ask:

1. **Is it deterministic?** (Same input → same output?)
2. **Does it perform IO?** (File, network, process?)
3. **Does it mutate global state?** (process.env, globals?)
4. **Does it depend on time?** (Date.now(), timers?)

If any answer is "yes" or "maybe," it does NOT belong in core.
