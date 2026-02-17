# Setup Domain - Adoption Strategy

**ECO-HK-P5:** COMPLETE — Implementation checklists archived (2026-02-16)

**Date:** 2026-02-16  
**Domain:** Setup/Configuration  
**Status:** ✅ Complete (27/27 entities adopted)  
**Migrations:** 0066-0072 (7 migrations)

---

## 📊 Current Status

**Last Updated:** 2026-02-16  
**Total Migrations Applied:** 72 (0000-0072)  
**Database Quality:** 10/10 (FK constraints, RLS, indexes, composite PKs)

### Platform Foundation ✅ COMPLETE

**Core Infrastructure (All Phases Complete):**

- ✅ **CRUD-SAP Kernel** - 5 phases complete (canon, crud, database, search, workflow, advisory)
- ✅ **Multi-Tenancy** - RLS + auth helpers + tenant policies on all tables
- ✅ **Neon Auth** - v0.2.0-beta.1 integrated (Better Auth 1.4.6)
- ✅ **Workflow V2** - All 3 phases complete (foundation, parallel/wait, user-facing)
- ✅ **Migration Engine** - Hardening complete (accuracy, speed, operations)
- ✅ **Capability Truth Ledger** - Full PRD + post-audit hardening
- ✅ **ERP Transactional Spine** - 72 migrations, 19 kernel services, 58 tests
- ✅ **Phase A-C Finance** - Fiscal periods, COA, journal entries, tax engine, payment allocation
- ✅ **E2E Testing** - Playwright configured (19 tests, 6 files)
- ✅ **CI/CD** - GitHub Actions (lint, test, audit, SBOM, E2E)

**Key Packages:**

- `afenda-canon` - Types, Zod schemas, capability system
- `afenda-crud` - Kernel mutate(), 19 services, 222 tests passing
- `afenda-database` - 72 migrations, RLS on all tables
- `afenda-workflow` - V2 engine, 203 tests passing
- `afenda-migration` - 112 tests passing, conflict detection
- `afenda-advisory` - Math-first (no LLMs), 25 tests

### Setup Domain Adoption ✅ COMPLETE (27/27)

**All 4 phases complete.** Migrations 0066-0072. Three canonical patterns validated: Singleton Config, Master Data, Line Entity.

| Phase | Entities | Migration | Status |
|-------|----------|-----------|--------|
| **Phase 1** | branches, departments, accounts-settings, stock-settings, global-defaults | 0066-0069 | ✅ |
| **Phase 2** | selling-settings, buying-settings, manufacturing-settings, designations, employee-groups, holiday-lists, holidays | 0070 | ✅ |
| **Phase 3** | authorization-controls, authorization-rules, item-variant-settings, currency-exchange-settings, currency-exchange-settings-details, crm-settings | 0071 | ✅ |
| **Phase 4** | south-africa-vat-settings, uae-vat-settings, incoming-call-settings, voice-call-settings, appointment-booking-settings, plaid-settings, subscription-settings, repost-accounting-ledger-settings, stock-reposting-settings | 0072 | ✅ |

**Pre-adopted (before Setup phases):** delivery-settings, pos-settings, projects-settings, support-settings, video-settings

**✅ Implementation complete (2026-02-16):** All 27 Setup entities adopted. Adoption config, handlers, BFF, and registry updated. See `SETUP_DOMAIN_AUDIT_REPORT.md` for root-cause analysis.

---

## 🎯 Adoption Strategy (Reference — All Phases Complete)

### Phase 1: Critical Foundation (6 entities) ✅

**Goal:** Enable core system configuration and organizational structure

**Dependency-Safe Ordering:** Phase 1 entities have ZERO external dependencies. All FK columns created now, constraints added later when targets exist.

**Entities (in execution order):**

1. ✅ **`branches`** (master) - **QUICK WIN**
   - **Why:** Simplest entity, zero dependencies
   - **Complexity:** Lowest - just name field
   - **Fields:** branch (name)
   - **Dependencies:** None
   - **Benefit:** Multi-location support
   - **Unique Constraint:** `UNIQUE(org_id, branch)`
   - **Execution:** Start here for confidence

2. ✅ **`departments`** (master) - **ORGANIZATIONAL STRUCTURE**
   - **Why:** Used across HR, projects, expenses, assets
   - **Complexity:** Low - self-reference only
   - **Fields:** department_name, parent_department, company
   - **Dependencies:** Self-reference for hierarchy
   - **Benefit:** Organizational structure foundation
   - **FK Strategy:**
     - `parent_department` → `departments(id)` (self-reference, add now)
     - `company` column nullable, NO .references() yet (add FK later)
   - **Unique Constraint:** `UNIQUE(org_id, department_name)`

3. ✅ **`accounts-settings`** (config - singleton) - **ACCOUNTING FOUNDATION**
   - **Why:** Accounting module configuration
   - **Complexity:** Low - boolean flags and defaults
   - **Fields:** Various accounting behavior flags
   - **Dependencies:** None (mostly boolean settings)
   - **Benefit:** Accounting foundation
   - **Pattern:** Singleton - `UNIQUE(org_id)`
   - **Handler:** Upsert by org_id (not by id)

4. ✅ **`stock-settings`** (config - singleton) - **INVENTORY FOUNDATION**
   - **Why:** Inventory management defaults
   - **Complexity:** Low - config flags
   - **Fields:** Valuation method, stock reconciliation settings
   - **Dependencies:** None
   - **Benefit:** Inventory foundation
   - **Pattern:** Singleton - `UNIQUE(org_id)`
   - **Handler:** Upsert by org_id

5. ✅ **`global-defaults`** (config - singleton) - **CRITICAL**
   - **Why:** System-wide defaults, affects all modules
   - **Complexity:** Low - singleton config entity
   - **Pattern:** UNIQUE(org_id) - one record per org
   - **Fields:** default_company, default_currency, default_customer_group, etc.
   - **Dependencies:** Links to companies, currencies (may need to handle missing refs)
   - **Benefit:** Foundation for entire system
   - **FK Strategy:** Columns now, constraints later
     - Create nullable UUID columns: `default_company`, `default_currency`, etc.
     - **DO NOT add .references()** until target tables adopted
     - Add FK constraints in refinement migration when targets exist
   - **Handler:** Upsert by org_id (singleton pattern)

6. ✅ **`currency-exchanges`** (master) - **CONDITIONAL**
   - **Why:** Multi-currency support
   - **Complexity:** Low - exchange rate records
   - **Fields:** date, from_currency, to_currency, exchange_rate
   - **Dependencies:** currencies table
   - **Benefit:** International operations
   - **FK Strategy:**
     - Create `from_currency`, `to_currency` columns nullable
     - **DO NOT add .references()** until currencies table adopted
     - Add FK constraints in refinement migration
   - **Indexes:** `(org_id, date)`, `(org_id, from_currency, to_currency)`
   - **IMPORTANT:** Only adopt if currencies already exists, otherwise move to Phase 2

**OLD ORDER (removed):**

~~2. ✅ **`departments`** (master) - **HIGH PRIORITY**~~

- **Why:** Used across HR, projects, expenses, assets
- **Complexity:** Low - simple master with self-reference
- **Fields:** department_name, parent_department, company
- **Dependencies:** Self-reference for hierarchy
- **Benefit:** Organizational structure foundation
- **FK Constraints:**
  ~~(moved to position 2 above)~~

**Estimated Effort:** 3-4 hours  
**Risk:** **ZERO** - No external dependencies, all FK constraints deferred  
**Impact:** High - Enables core ERP functionality

**Dependency-Safe Guarantee:**

- ✅ No .references() to non-adopted tables
- ✅ All FK columns nullable
- ✅ Self-references only (departments)
- ✅ Singleton configs have no FK dependencies
- ✅ Can execute in any order (recommended order optimizes for confidence)

---

### Phase 2: Domain-Specific Settings (7 entities) ✅

**Goal:** Enable module-specific configurations

**Entities:**

1. **`selling-settings`** (config)
   - Sales module configuration
   - Pricing rules, customer defaults
   - Singleton pattern

2. **`buying-settings`** (config)
   - Procurement configuration
   - Supplier defaults, approval workflows
   - Singleton pattern

3. **`manufacturing-settings`** (config)
   - Production configuration
   - BOM defaults, capacity planning
   - Singleton pattern

4. **`designations`** (master)
   - Job titles/positions
   - Used in HR module
   - **Unique:** `UNIQUE(org_id, designation)`

5. **`employee-groups`** (master)
   - Employee categorization
   - Used for permissions, policies
   - **Unique:** `UNIQUE(org_id, name)`

6. **`holiday-lists`** (master)
   - Holiday calendar definitions
   - Used for leave management
   - **Unique:** `UNIQUE(org_id, name)`

7. **`holidays`** (line)
   - Individual holiday entries
   - Child of holiday-lists
   - **FK:** `holiday_list` → `holiday_lists(id)`

**Estimated Effort:** 3-4 hours  
**Risk:** Low-Medium  
**Impact:** Medium - Enables HR and domain-specific features

---

### Phase 3: Authorization & Advanced (6 entities) ✅

**Goal:** Security and advanced configurations

**Entities:**

1. **`authorization-controls`** (master)
   - Document approval controls
   - Workflow authorization
   - Medium complexity

2. **`authorization-rules`** (master)
   - Approval rule definitions
   - Based on conditions/thresholds
   - Medium complexity

3. **`crm-settings`** (config)
   - CRM module configuration
   - Lead/opportunity defaults

4. **`item-variant-settings`** (config)
   - Product variant configuration
   - Attribute management

5. **`currency-exchange-settings`** (config)
   - Exchange rate provider config
   - API settings for auto-fetch

6. **`currency-exchange-settings-details`** (line)
   - Provider-specific settings
   - Child of currency-exchange-settings

**Estimated Effort:** 3-4 hours  
**Risk:** Medium  
**Impact:** Medium - Advanced features

---

### Phase 4: Specialized Settings (9 entities) ✅

**Goal:** Complete setup domain coverage

**Entities:**

- Regional VAT settings (2 entities: south-africa, uae)
- Communication settings (3 entities: incoming-call, voice-call, appointment-booking)
- Integration settings (plaid, subscription)
- Reposting settings (2 entities)
- Other specialized configs

**Estimated Effort:** 2-3 hours  
**Risk:** Low  
**Impact:** Low - Specialized use cases

---

## 📋 Implementation Reference (Historical — All Phases Complete)

### Step 1: Adopt `branches` (Easiest First)

```bash
# 1. Update spec
# File: packages/canon/src/specs/entities/branches.spec.json
# Add:
{
  "adoptionLevel": "adopt",
  "domain": "setup"
}

# 2. Create schema
# File: packages/database/src/schema/branches.ts

export const branches = pgTable(
  'branches',
  {
    ...erpEntityColumns,
    branch: text('branch').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('branches_org_name_unique').on(table.orgId, table.branch),
    index('branches_org_created_id_idx').on(
      table.orgId,
      desc(table.createdAt),
      desc(table.id)
    ),
    check('branches_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

# 3-6. Standard workflow
# Update adoption config, generate code, generate migration, validate
```

### Step 2: Adopt `departments` (Self-Reference Pattern)

```bash
# Key: Self-referencing FK is OK, company FK deferred

export const departments = pgTable(
  'departments',
  {
    ...erpEntityColumns,
    departmentName: text('department_name').notNull(),
    parentDepartment: uuid('parent_department').references((): any => departments.id),
    company: uuid('company'), // Nullable, NO .references() yet
    isGroup: boolean('is_group').default(false),
    disabled: boolean('disabled').default(false),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('departments_org_name_unique').on(table.orgId, table.departmentName),
    index('departments_org_created_id_idx').on(
      table.orgId,
      desc(table.createdAt),
      desc(table.id)
    ),
    index('departments_org_parent_idx').on(table.orgId, table.parentDepartment),
    check('departments_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);
```

### Steps 3-4: Adopt Singleton Configs

```bash
# accounts-settings and stock-settings
# Pattern: UNIQUE(org_id) enforces singleton

export const accountsSettings = pgTable(
  'accounts_settings',
  {
    ...erpEntityColumns,
    // Boolean flags and default values
    unlinkPaymentOnCancellation: boolean('unlink_payment_on_cancellation').default(false),
    // ... other settings
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('accounts_settings_org_singleton').on(table.orgId), // SINGLETON
    index('accounts_settings_org_created_id_idx').on(
      table.orgId,
      desc(table.createdAt),
      desc(table.id)
    ),
    check('accounts_settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

# Handler pattern: Upsert by org_id
# UPDATE WHERE org_id = ? OR INSERT
```

### Step 5: Adopt `global-defaults` (Singleton with Deferred FKs)

````bash
```bash
# CRITICAL: Singleton config, not master
# All FK columns nullable, NO .references() yet

export const globalDefaults = pgTable(
  'global_defaults',
  {
    ...erpEntityColumns,
    // All nullable - FK constraints added later
    defaultCompany: uuid('default_company'),
    defaultCurrency: uuid('default_currency'),
    defaultCustomerGroup: uuid('default_customer_group'),
    defaultSupplierGroup: uuid('default_supplier_group'),
    defaultWarehouse: uuid('default_warehouse'),
    defaultCostCenter: uuid('default_cost_center'),
    country: uuid('country'),
    defaultDistanceUnit: uuid('default_distance_unit'),
    // ... other defaults (see spec for full list)
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    unique('global_defaults_org_singleton').on(table.orgId), // SINGLETON
    index('global_defaults_org_created_id_idx').on(
      table.orgId,
      desc(table.createdAt),
      desc(table.id)
    ),
    check('global_defaults_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

# Handler: Upsert by org_id (singleton pattern)
# Later: Add FK constraints when companies, currencies, etc. are adopted

````

### Step 6: Adopt `currency-exchanges` (Conditional)

```bash
# ONLY if currencies table already adopted
# Otherwise skip to Phase 2

export const currencyExchanges = pgTable(
  'currency_exchanges',
  {
    ...erpEntityColumns,
    date: date('date').notNull(),
    fromCurrency: uuid('from_currency').notNull(), // NO .references() yet
    toCurrency: uuid('to_currency').notNull(), // NO .references() yet
    exchangeRate: decimal('exchange_rate', { precision: 18, scale: 6 }).notNull(),
    forBuying: decimal('for_buying', { precision: 18, scale: 6 }),
    forSelling: decimal('for_selling', { precision: 18, scale: 6 }),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    index('currency_exchanges_org_created_id_idx').on(
      table.orgId,
      desc(table.createdAt),
      desc(table.id)
    ),
    index('currency_exchanges_org_date_idx').on(table.orgId, table.date),
    index('currency_exchanges_org_pair_idx').on(
      table.orgId,
      table.fromCurrency,
      table.toCurrency
    ),
    check('currency_exchanges_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ]
);

# Later: Add FK constraints when currencies adopted
```

### Standard Workflow for All Entities

```bash
# 1. Update spec (adoptionLevel + domain)
# 2. Create schema (follow patterns above)
# 3. Update adoption config
# 4. Generate code — use adapter build (recommended)
pnpm adapter:build

# Or run adapters individually:
# pnpm afenda meta handler-emit
# pnpm afenda meta bff-emit
# pnpm afenda meta registry-emit

# 5. Generate migration
cd packages/database
pnpm drizzle-kit generate

# 6. VALIDATE migration SQL
# ✅ Composite PK (org_id, id)
# ✅ UNIQUE(org_id) for singletons OR UNIQUE(org_id, name) for masters
# ✅ Standard index (org_id, created_at desc, id desc)
# ✅ NO .references() to non-adopted tables
# ✅ RLS policies (4 policies)
# ✅ Check constraint (org_id <> '')
```

---

## 🎨 Domain Architecture

### Entity Relationships

```
setup (foundation layer)
├── global-defaults (singleton)
│   ├── → companies (default_company)
│   ├── → currencies (default_currency)
│   ├── → customer-groups (default_customer_group)
│   └── → warehouses (default_warehouse)
│
├── organizational structure
│   ├── departments (self-referencing hierarchy)
│   │   └── → departments (parent_department)
│   ├── branches (simple master)
│   ├── designations (simple master)
│   └── employee-groups (simple master)
│
├── currency/exchange
│   ├── currency-exchanges (master)
│   │   ├── → currencies (from_currency)
│   │   └── → currencies (to_currency)
│   └── currency-exchange-settings (config)
│       └── currency-exchange-settings-details (line)
│
├── domain settings (singletons)
│   ├── accounts-settings
│   ├── stock-settings
│   ├── selling-settings
│   ├── buying-settings
│   ├── manufacturing-settings
│   ├── crm-settings
│   └── item-variant-settings
│
├── authorization
│   ├── authorization-controls
│   └── authorization-rules
│
└── specialized settings
    ├── holiday-lists
    │   └── holidays (line)
    ├── regional VAT settings
    └── communication settings
```

### Domain Coverage

- **Configuration:** 5/20 (25%) - 15 more to adopt
- **Master Data:** 0/10+ (0%) - All in phases 1-3
- **Line Items:** 0/3 (0%) - Phase 2-3

---

## ⚠️ Important Considerations

### 1. Singleton Pattern for Settings

**Challenge:** Config entities should have only ONE record per org

**Options:**

1. **DB Constraint:** Add `UNIQUE(org_id)` constraint
2. **Application Logic:** Enforce in handlers (upsert pattern)
3. **Hybrid:** Unique constraint + upsert logic

**Recommendation:** Use application logic for flexibility, add unique constraint for safety

### 2. Missing FK Targets

**Challenge:** Some FKs reference tables not yet adopted (companies, currencies, etc.)

**Options:**

1. **Skip FKs initially:** Add in refinement migration later
2. **Nullable FKs:** Make FK columns nullable
3. **Check existence:** Only add FK if target table exists

**Recommendation:** Make FK columns nullable, add constraints when target tables are adopted

### 3. Self-Referencing Hierarchies

**Pattern for departments:**

```typescript
parentDepartment: uuid('parent_department').references((): any => departments.id);
```

**Considerations:**

- Use `(): any =>` workaround for Drizzle
- Add index on parent column for hierarchy queries
- Consider adding `is_group` flag for parent nodes

### 4. Unique Constraints Strategy

**Natural keys that need uniqueness:**

- `departments`: `(org_id, department_name)`
- `branches`: `(org_id, branch)`
- `designations`: `(org_id, designation)`
- `employee-groups`: `(org_id, name)`
- `holiday-lists`: `(org_id, name)`

**Pattern:**

```typescript
unique('table_org_name_unique').on(table.orgId, table.nameColumn);
```

### 5. Settings Entity Pattern

**Common structure:**

```typescript
export const someSettings = pgTable(
  'some_settings',
  {
    ...erpEntityColumns,
    // Boolean flags
    enableFeature: boolean('enable_feature').default(false),
    autoProcess: boolean('auto_process').default(true),
    // Default values
    defaultValue: text('default_value'),
    // Thresholds
    threshold: decimal('threshold', { precision: 18, scale: 2 }),
  },
  (table) => [
    primaryKey({ columns: [table.orgId, table.id] }),
    // Consider: unique('settings_org_unique').on(table.orgId), // Singleton
    index('settings_org_created_id_idx').on(table.orgId, desc(table.createdAt), desc(table.id)),
    check('settings_org_not_empty', sql`org_id <> ''`),
    tenantPolicy(table),
  ],
);
```

---

## 📈 Success Metrics

### After Phase 1 (11/~35 = 31%)

- ✅ Core system defaults configured
- ✅ Organizational structure defined
- ✅ Multi-currency support enabled
- ✅ Accounting & inventory foundations
- ✅ Critical foundation complete

### After Phase 2 (18/~35 = 51%)

- ✅ Domain-specific settings available
- ✅ HR foundation (departments, designations, groups)
- ✅ Holiday management
- ✅ Module configurations complete

### After Phase 3 (24/~35 = 69%)

- ✅ Authorization framework in place
- ✅ Advanced configurations available
- ✅ CRM and variant management
- ✅ Currency exchange automation

### After Phase 4 (35/~35 = 100%)

- ✅ Complete setup domain coverage
- ✅ All specialized configurations
- ✅ Regional compliance settings
- ✅ Foundation for all other domains

---

## 🚀 Recommended Next Action

**Start Phase 1 immediately:**

```bash
# Priority order for Phase 1 (6 entities):
1. global-defaults (CRITICAL - system foundation)
2. departments (HIGH - used across all domains)
3. branches (HIGH - multi-location support)
4. currency-exchanges (HIGH - international operations)
5. accounts-settings (HIGH - accounting foundation)
6. stock-settings (HIGH - inventory foundation)

# Estimated time: 3-4 hours
# Risk: Low - simple entities
# Impact: High - enables core ERP functionality

# Command sequence per entity:
1. Update spec file (add adoptionLevel + domain)
2. Create schema file with FK constraints
3. Add unique constraints for natural keys
4. Update adoption config
5. Generate handlers + BFF + registry
6. Generate migration
7. Validate migration SQL (FK, indexes, RLS)
8. Fix any issues (import order, missing FKs)
9. Repeat for next entity
```

**Expected Outcome:**

- 11/~35 entities adopted (31% complete)
- Core system configuration enabled
- Organizational structure defined
- Foundation for all other domains
- Database quality: 10/10 (same standards as projects)

---

## 📊 Comparison with Projects Domain

| Metric              | Projects                  | Setup                 | Notes                      |
| ------------------- | ------------------------- | --------------------- | -------------------------- |
| **Total Entities**  | 14                        | ~35                   | Setup is larger            |
| **Complexity**      | Medium                    | **Low**               | Setup is simpler           |
| **Entity Types**    | Config, Master, Doc, Line | Mostly Config, Master | Fewer doc types            |
| **Estimated Time**  | 3-4 days                  | **2-3 days**          | Faster per entity          |
| **Dependencies**    | Moderate                  | Low                   | Less complex relationships |
| **Strategic Value** | High                      | **Critical**          | Foundation layer           |
| **Risk**            | Low-Medium                | **Low**               | Simpler entities           |

**Setup domain advantages:**

- ✅ **Simpler entities** - Mostly config and simple masters
- ✅ **Fewer dependencies** - Less complex relationships
- ✅ **Faster adoption** - No complex docs or lines
- ✅ **Higher leverage** - Affects entire system
- ✅ **Lower risk** - Straightforward implementations

---

## 💡 Strategic Recommendation

**Adopt setup domain next** because:

1. ✅ **Foundation Layer** - Required for all other domains
2. ✅ **Low Complexity** - Simpler than projects domain
3. ✅ **High Leverage** - Small effort, system-wide impact
4. ✅ **Clear Scope** - Well-defined boundaries
5. ✅ **Proven Patterns** - Reuse projects domain learnings
6. ✅ **Quick Wins** - Faster per-entity adoption
7. ✅ **Critical Path** - Unblocks future domain adoptions

**Alternative:** Could continue with support domain (12 entities, 25% done) but setup provides more strategic value.

**Recommendation:** **Complete setup domain to 100%** (~35 entities) to establish solid foundation before moving to transactional domains (selling, buying, stock).

---

## 📋 Implementation Checklist

### For Each Entity:

- [ ] Update spec with `adoptionLevel: "adopt"` and `domain: "setup"`
- [ ] Create Drizzle schema in `packages/database/src/schema/`
- [ ] Add FK constraints where applicable (handle missing targets)
- [ ] Add unique constraints for natural keys
- [ ] Add indexes (standard + domain-specific)
- [ ] Ensure RLS policies (4 per entity)
- [ ] Add to `adopted.entities.json`
- [ ] Generate code: `pnpm adapter:build` (or individually: handler-emit, bff-emit, registry-emit)
- [ ] Generate migration: `pnpm drizzle-kit generate`
- [ ] **Validate migration SQL:**
  - [ ] Composite PK present
  - [ ] FK constraints present (or documented why not)
  - [ ] Unique constraints present
  - [ ] Indexes created
  - [ ] RLS policies active (4 policies)
  - [ ] Check constraint present
- [ ] Fix any lint errors (import order, spacing)
- [ ] Run build validation
- [ ] Document any findings or issues

### Quality Standards (From Projects Domain):

✅ **Database Quality: 10/10**

- All FK constraints explicit and validated
- Unique constraints on natural keys
- Comprehensive indexing (standard + domain-specific)
- Perfect RLS coverage (4 policies per entity)
- Composite PKs everywhere
- Check constraints for org_id
- Zero technical debt

✅ **Code Quality:**

- Clean imports (proper spacing, ordering)
- No lint errors
- Consistent patterns
- Well-documented schemas

---

## 🎯 Success Criteria

- [ ] All setup entities have proper FK constraints
- [ ] Unique constraints on natural keys (departments, branches, etc.)
- [ ] Comprehensive RLS policies (4 per entity)
- [ ] Clean migrations with no technical debt
- [ ] Database quality score: 10/10
- [ ] Zero lint errors
- [ ] All builds passing
- [ ] Singleton pattern enforced for config entities
- [ ] Self-referencing hierarchies working (departments)
- [ ] Multi-currency support enabled
- [ ] Foundation ready for other domains

---

## 📝 Notes & Findings

### To Be Documented During Implementation:

- Any challenges with singleton pattern enforcement
- FK constraint handling for missing target tables
- Self-referencing hierarchy patterns
- Settings entity best practices
- Performance considerations for exchange rates
- Any Drizzle ORM quirks or workarounds
- Migration validation process improvements
- Code generation issues or bugs

**Update this section as you progress through phases.**
