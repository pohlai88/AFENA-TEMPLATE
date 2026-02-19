# Entity Contract Registry

Pure metadata registry for entity contracts with build-time validation and deep immutability.

## Architecture

**Pure Metadata Pattern:**
- No runtime services, no singleton factories, no I/O
- Build once at module load, deeply frozen
- Validation report + events returned as data
- Pure query functions (tree-shakeable)

## Current Registry

The registry currently includes **56 entity contracts** covering all major business domains:

### By Lifecycle Pattern

- **28 Transactional Documents** - Full lifecycle with approval workflow
  - Examples: invoices, purchase_orders, sales_orders, payments, expense_reports
  - Pattern: draft → submitted → active → cancelled
  
- **23 Master Data** - Simple CRUD without approval workflow
  - Examples: contacts, products, customers, suppliers, employees
  - Pattern: create → update → delete → restore
  
- **5 Configuration** - Reference data with minimal lifecycle
  - Examples: currencies, uom, tax_codes, payment_terms
  - Pattern: create → update (no delete)

### By Business Class

| Class | Domains | Contracts | Coverage |
|-------|---------|-----------|----------|
| Financial Management | 25 | 10 | 40% |
| Procurement & Supply Chain | 15 | 8 | 53% |
| Sales, Marketing & CX | 11 | 6 | 55% |
| Manufacturing & Quality | 11 | 6 | 55% |
| Human Capital Management | 9 | 5 | 56% |
| Agriculture & AgriTech | 10 | 2 | 20% |
| Franchise & Retail | 7 | 2 | 29% |
| Governance, Risk & Compliance | 15 | 5 | 33% |
| Analytics, Data & Integration | 10 | 5 | 50% |
| Corporate & Strategy | 3 | 2 | 67% |
| **Total** | **116** | **56** | **48%** |

## Usage

### Basic Usage

```typescript
import { 
  ENTITY_CONTRACT_REGISTRY,
  getContract,
  listContracts,
  findByVerb 
} from 'afenda-canon';

// Get a contract
const contract = getContract(ENTITY_CONTRACT_REGISTRY, 'companies');
// Returns: EntityContract for companies

// Get a simple CRUD entity
const contactsContract = getContract(ENTITY_CONTRACT_REGISTRY, 'contacts');
// Returns: EntityContract with no lifecycle

// List all contracts
const all = listContracts(ENTITY_CONTRACT_REGISTRY);
// Returns: Array of 56 contracts

// Find contracts that support a verb
const withSubmit = findByVerb(ENTITY_CONTRACT_REGISTRY, 'submit');
// Returns: All 28 transactional documents

// Find contracts with lifecycle
const withLifecycle = findWithLifecycle(ENTITY_CONTRACT_REGISTRY);
// Returns: All 28 transactional documents
```

### Validation Report

```typescript
import { ENTITY_CONTRACT_VALIDATION_REPORT } from 'afenda-canon';

// Check if registry is valid
if (!ENTITY_CONTRACT_VALIDATION_REPORT.valid) {
  console.warn('Registry validation issues:', ENTITY_CONTRACT_VALIDATION_REPORT.issues);
}

// Get stats
console.log('Total contracts:', ENTITY_CONTRACT_VALIDATION_REPORT.stats.total);
console.log('With lifecycle:', ENTITY_CONTRACT_VALIDATION_REPORT.stats.withLifecycle);
```

### Build Events (for observability)

```typescript
import { ENTITY_CONTRACT_BUILD_EVENTS } from 'afenda-canon';

// Log registration events in app layer
for (const event of ENTITY_CONTRACT_BUILD_EVENTS) {
  if (event.type === 'registered') {
    logger.info({ entityType: event.entityType }, 'Contract registered');
  } else if (event.type === 'validation_issue') {
    logger.warn({ issue: event.issue }, 'Validation issue');
  }
}
```

## Adding New Contracts

### Step 1: Define Contract in SSOT

Edit `entity-contracts.data.ts`:

```typescript
export const invoicesContract: EntityContract = {
  entityType: 'invoices',
  label: 'Invoice',
  labelPlural: 'Invoices',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'submit', 'delete'] },
    { from: 'submitted', allowed: ['approve', 'reject'] },
    { from: 'active', allowed: ['cancel'] },
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: ['delete', 'cancel', 'reject'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['create', 'update', 'submit'],
  secondaryVerbs: ['delete', 'cancel'],
} as const;

// Add to SSOT list
export const ENTITY_CONTRACTS = [
  companiesContract,
  invoicesContract, // Add here
] as const;
```

### Step 2: Build & Verify

The registry rebuilds automatically at module load. Run tests:

```bash
pnpm test registries
```

## Query Helpers

All query helpers are pure functions (tree-shakeable):

```typescript
// Get contract by entity type
getContract(registry, entityType): EntityContract | undefined

// List all contracts
listContracts(registry): EntityContract[]

// Find by predicate
findContracts(registry, predicate): EntityContract[]

// Find by label (case-insensitive)
findByLabel(registry, label): EntityContract | undefined

// Find by verb
findByVerb(registry, verb): EntityContract[]

// Find with lifecycle
findWithLifecycle(registry): EntityContract[]

// Find with soft delete
findWithSoftDelete(registry): EntityContract[]

// Check existence
hasContract(registry, entityType): boolean

// Get size
getSize(registry): number
```

## Custom Registry Builds

For testing or custom scenarios:

```typescript
import { buildEntityContractRegistry } from 'afenda-canon';

const result = buildEntityContractRegistry(
  [customContract1, customContract2],
  { 
    strict: false, // Don't throw on validation failures
    skipSemanticValidation: true // Skip lifecycle graph checks
  }
);

// Access registry
const registry = result.registry;

// Check validation
if (!result.report.valid) {
  console.log('Issues:', result.report.issues);
}

// Review events
console.log('Events:', result.events);
```

## Validation

### Structural Validation (Zod)

- Schema must match `EntityContract` interface
- All required fields present
- Correct types for all fields

### Semantic Validation (Lifecycle Graph)

**Hard Invariants (fail):**
- Empty `allowed` arrays
- Duplicate verbs within same state
- Invalid status references

**Soft Invariants (warn):**
- Unreachable states (some entities won't implement full lifecycle yet)
- Cycles (some workflows are cyclic by design)

## Immutability

All contracts are deeply frozen:

```typescript
const contract = getContract(ENTITY_CONTRACT_REGISTRY, 'companies')!;

// These all throw TypeError
contract.label = 'Modified'; // ❌
contract.transitions.push({...}); // ❌
contract.transitions[0].from = 'active'; // ❌
contract.transitions[0].allowed.push('invalid'); // ❌
```

## Testing

See `__tests__/entity-contract-registry.invariants.test.ts` for examples:

- **REG-01**: Duplicate prevention
- **REG-02**: Schema validation
- **REG-03**: Deep immutability
- **REG-04**: Lifecycle graph validation
- **REG-05**: Determinism
- **REG-06**: Query correctness

## Architecture Principles

1. **Pure Data** - No classes, no lifecycle, no mutation
2. **Build Once** - Registry built at module load, frozen
3. **Validation as Data** - Report + events returned, not logged
4. **Tree-Shakeable** - All queries are pure functions
5. **Zero I/O** - No logging, no metrics, no side effects
6. **Deterministic** - Same input → same output

## Migration from Old Pattern

**Old (Partial<Record>):**
```typescript
const contract = ENTITY_CONTRACT_REGISTRY.companies; // May be undefined
```

**New (ReadonlyMap):**
```typescript
const contract = getContract(ENTITY_CONTRACT_REGISTRY, 'companies'); // Type-safe
```

## Performance

- **Build time**: <10ms for 10 contracts
- **Lookup**: O(1) via Map.get()
- **List/Search**: O(n) iteration
- **Memory**: Frozen once, no runtime overhead
