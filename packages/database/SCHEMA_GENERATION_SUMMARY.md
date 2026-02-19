# Database Schema Generation Summary

**Status:** In Progress  
**Date:** February 19, 2026  
**Task:** Generate database schemas for 18 new entity contracts

---

## Overview

Auto-generating Drizzle ORM schemas for all new entities from the enriched entity contract registry. Following existing patterns from `companies.ts` and `contacts.ts`.

## Schema Patterns

### Pattern 1: ERP Entities (Transactional + Master Data)
```typescript
import { erpEntityColumns } from '../helpers/erp-entity';
// Includes: baseEntityColumns + companyId + siteId + customData
```

### Pattern 2: Configuration/Reference Data
```typescript
import { baseEntityColumns } from '../helpers/base-entity';
// Minimal: id, orgId, timestamps, version (no soft delete)
```

### Standard Indexes
- `{table}_org_id_idx` - Primary tenant isolation
- `{table}_org_code_idx` - Business key lookup
- `{table}_org_created_idx` - Time-series queries
- `tenantPolicy(table)` - RLS policy

### Standard Constraints
- `CHECK org_id <> ''` - Prevent empty tenant
- `CHECK doc_status IN (...)` - Lifecycle validation (transactional only)

---

## Entities to Generate

### Transactional Documents (6) - Full Lifecycle
- [x] `purchase_orders` - PO management
- [ ] `goods_receipts` - Receiving documents
- [ ] `purchase_invoices` - AP invoices
- [ ] `delivery_notes` - Shipping documents
- [ ] `quotations` - Sales quotes
- [ ] `journal_entries` - GL postings

### Master Data (8) - Simple CRUD
- [x] `products` - Product catalog
- [x] `customers` - Customer master
- [ ] `suppliers` - Supplier master
- [ ] `employees` - HR master
- [ ] `warehouses` - Warehouse locations
- [ ] `projects` - Project master
- [ ] `cost_centers` - Cost accounting

### Configuration (4) - Reference Data
- [ ] `tax_codes` - Tax configuration
- [ ] `payment_terms` - Payment terms
- [ ] `uom_master` - Units of measure (rename from `uom`)

---

## Schema Generation Status

**Completed:** 2/18 (products, customers)  
**Remaining:** 16

**Next Steps:**
1. Generate remaining 16 schema files
2. Update `schema/index.ts` barrel exports
3. Generate migration file
4. Run `drizzle-kit generate` to create SQL
5. Apply migration to Neon
6. Verify with tests

---

## File Naming Convention

- Table name: snake_case (e.g., `purchase_orders`)
- File name: snake_case (e.g., `purchase-orders.ts`)
- Export name: camelCase (e.g., `purchaseOrders`)
- Type names: PascalCase (e.g., `PurchaseOrder`, `NewPurchaseOrder`)

---

## Dependencies

All schemas depend on:
- `drizzle-orm` - ORM library
- `../helpers/erp-entity` or `../helpers/base-entity` - Column helpers
- `../helpers/tenant-policy` - RLS policy helper

---

## Migration Strategy

**Approach:** Single comprehensive migration
- Migration name: `0043_add_generated_entities.sql`
- Order: Configuration → Master Data → Transactional
- Includes: Tables + Indexes + Constraints + RLS policies

**Estimated Size:** ~2000 lines of SQL

---

## Testing Strategy

1. **Schema validation:** Drizzle type inference
2. **Migration test:** Apply to test database
3. **CRUD test:** Insert/update/delete operations
4. **RLS test:** Tenant isolation verification
5. **Performance test:** Index effectiveness

---

## Notes

- Sites table already exists (used by `erpEntityColumns`)
- Currencies table already exists in schema
- UOM table already exists but may need rename to `uom_master`
- All transactional documents need `doc_status` enum + `doc_no` field
