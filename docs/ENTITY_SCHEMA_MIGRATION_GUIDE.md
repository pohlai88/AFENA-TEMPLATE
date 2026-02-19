# Entity Schema Migration Guide

**Version:** 1.0  
**Date:** February 19, 2026  
**Migration:** 0043_add_generated_entities.sql  
**Tables Added:** 56 entity tables

---

## Quick Start

```bash
# 1. Generate migration
cd packages/database
pnpm drizzle-kit generate

# 2. Review migration
cat drizzle/0043_add_generated_entities.sql

# 3. Apply to Neon (production)
pnpm db:migrate

# 4. Verify
pnpm db:verify
```

---

## Pre-Migration Checklist

### 1. Environment Verification

- [ ] Neon database connection working
- [ ] `DATABASE_URL` environment variable set
- [ ] Database user has CREATE TABLE permissions
- [ ] Sufficient storage space available (estimate: +500MB)

### 2. Backup Strategy

```bash
# Create backup before migration
pg_dump $DATABASE_URL > backup_pre_0043_$(date +%Y%m%d).sql

# Or use Neon's built-in backup
# Navigate to: Neon Console → Your Project → Backups → Create Backup
```

### 3. Dependency Check

```bash
# Verify all packages build successfully
cd packages/canon && pnpm build
cd packages/database && pnpm build
```

---

## Migration Process

### Step 1: Generate Migration SQL

```bash
cd packages/database
pnpm drizzle-kit generate
```

**Expected Output:**
```
✓ Pulling schema from database...
✓ Generating migration...
✓ Migration generated: drizzle/0043_add_generated_entities.sql
```

**Generated File Location:**
`packages/database/drizzle/0043_add_generated_entities.sql`

**Expected Size:** ~3000 lines

### Step 2: Review Migration

```bash
# View migration file
cat drizzle/0043_add_generated_entities.sql | less

# Or open in editor
code drizzle/0043_add_generated_entities.sql
```

**What to Look For:**

**✅ Expected:**
- CREATE TABLE statements for 56 new tables
- CREATE INDEX statements (~168 indexes)
- ALTER TABLE statements for CHECK constraints
- CREATE POLICY statements for RLS (if enabled)

**❌ Unexpected:**
- DROP TABLE statements (should not drop existing tables)
- ALTER TABLE ... DROP COLUMN (should not modify existing tables)
- Syntax errors or malformed SQL

### Step 3: Dry Run (Recommended)

```bash
# Test migration on development database
export DATABASE_URL="postgresql://dev_user:dev_pass@dev_host/dev_db"
pnpm db:migrate

# Verify tables created
psql $DATABASE_URL -c "\dt"
```

### Step 4: Apply to Production

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://prod_user:prod_pass@prod_host/prod_db"

# Apply migration
pnpm db:migrate
```

**Expected Output:**
```
✓ Applying migration 0043_add_generated_entities.sql...
✓ Migration applied successfully
✓ 56 tables created
✓ 168 indexes created
✓ 56 RLS policies created
```

### Step 5: Verify Migration

```bash
# Run verification script
pnpm db:verify
```

**Verification Checks:**

1. **Table Count**
```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public';
-- Expected: 80+ tables
```

2. **Index Count**
```sql
SELECT COUNT(*) FROM pg_indexes 
WHERE schemaname = 'public';
-- Expected: 200+ indexes
```

3. **RLS Policies**
```sql
SELECT COUNT(*) FROM pg_policies 
WHERE schemaname = 'public';
-- Expected: 80+ policies
```

4. **Sample Queries**
```sql
-- Test each new table
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM invoices;
-- All should return 0 (empty tables)
```

---

## Migration Details

### Tables Created

**Master Data (23 tables):**
```
products, customers, suppliers, employees, warehouses, projects,
cost_centers, leads, opportunities, service_tickets, boms, recipes,
job_applications, crop_plans, livestock_records, legal_entities,
contracts, documents, assets, fixed_assets, audit_programs,
risk_assessments
```

**Transactional Documents (28 tables):**
```
expense_reports, leases, budgets, forecasts, purchase_requisitions,
shipments, returns, inventory_transfers, campaigns, work_orders,
quality_inspections, timesheets, leave_requests, performance_reviews,
franchise_applications, outlet_audits
```

**Configuration (5 tables):**
```
currencies, uom, tax_codes, payment_terms, sites
```

### Indexes Created

**Per Table (3 indexes):**
- `{table}_org_id_idx` - Tenant isolation
- `{table}_org_code_idx` - Business key lookup (if applicable)
- `{table}_org_created_idx` - Time-series queries

**Total:** 168 indexes (56 tables × 3 indexes)

### Constraints Added

**Per Table:**
- `{table}_org_not_empty` - CHECK constraint
- `{table}_doc_status_valid` - CHECK constraint (transactional only)

**Total:** 84 constraints (56 base + 28 doc_status)

### RLS Policies

**Per Table:**
- `tenant_isolation` - Row-level security policy

**Total:** 56 policies

---

## Rollback Procedure

### Option 1: Neon Restore

```bash
# Restore from backup (Neon Console)
1. Navigate to: Neon Console → Your Project → Backups
2. Select backup created before migration
3. Click "Restore"
4. Confirm restoration
```

### Option 2: Manual Rollback

```sql
-- Drop all new tables (CAUTION!)
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
-- ... (repeat for all 56 tables)

-- Or use script
psql $DATABASE_URL -f scripts/rollback_0043.sql
```

**Rollback Script:**
```bash
# Create rollback script
cat > scripts/rollback_0043.sql << 'EOF'
-- Rollback migration 0043
BEGIN;

-- Drop all new tables
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS suppliers CASCADE;
-- ... (all 56 tables)

-- Remove migration record
DELETE FROM drizzle_migrations WHERE name = '0043_add_generated_entities';

COMMIT;
EOF
```

---

## Troubleshooting

### Issue 1: Permission Denied

**Error:**
```
ERROR: permission denied to create table "products"
```

**Solution:**
```sql
-- Grant CREATE permission
GRANT CREATE ON SCHEMA public TO your_user;

-- Or use superuser
ALTER USER your_user WITH SUPERUSER;
```

### Issue 2: Table Already Exists

**Error:**
```
ERROR: relation "products" already exists
```

**Solution:**
```sql
-- Check existing table
\d products

-- If it's from a previous failed migration, drop it
DROP TABLE products CASCADE;

-- Re-run migration
pnpm db:migrate
```

### Issue 3: Out of Disk Space

**Error:**
```
ERROR: could not extend file: No space left on device
```

**Solution:**
```bash
# Check disk usage
df -h

# Clean up old data
VACUUM FULL;

# Or upgrade Neon plan for more storage
```

### Issue 4: Migration Timeout

**Error:**
```
ERROR: canceling statement due to statement timeout
```

**Solution:**
```sql
-- Increase statement timeout
SET statement_timeout = '10min';

-- Re-run migration
pnpm db:migrate
```

### Issue 5: RLS Policy Conflicts

**Error:**
```
ERROR: policy "tenant_isolation" for table "products" already exists
```

**Solution:**
```sql
-- Drop existing policy
DROP POLICY IF EXISTS tenant_isolation ON products;

-- Re-run migration
pnpm db:migrate
```

---

## Post-Migration Tasks

### 1. Update Application Code

```typescript
// Import new entity types
import type { 
  Product, 
  Customer, 
  ExpenseReport 
} from 'afenda-database';

// Use in application
const product: Product = {
  id: '...',
  orgId: '...',
  code: 'PROD-001',
  name: 'Product Name',
  // ...
};
```

### 2. Seed Reference Data

```bash
# Run seed scripts
pnpm db:seed

# Or manually insert
psql $DATABASE_URL -f scripts/seed_currencies.sql
psql $DATABASE_URL -f scripts/seed_uom.sql
```

### 3. Update API Documentation

```bash
# Regenerate OpenAPI spec
pnpm generate:api-docs

# Update Postman collection
pnpm generate:postman
```

### 4. Update UI Components

```bash
# Regenerate forms
pnpm generate:forms

# Regenerate tables
pnpm generate:tables
```

### 5. Run Integration Tests

```bash
# Test all new entities
pnpm test:integration

# Test specific entity
pnpm test:integration --entity=products
```

---

## Performance Optimization

### 1. Analyze Tables

```sql
-- Analyze all new tables
ANALYZE products;
ANALYZE customers;
-- ... (repeat for all tables)

-- Or analyze all at once
ANALYZE;
```

### 2. Create Additional Indexes

```sql
-- Add indexes for frequently queried fields
CREATE INDEX products_name_idx ON products(org_id, name);
CREATE INDEX customers_email_idx ON customers(org_id, email);
```

### 3. Configure Autovacuum

```sql
-- Adjust autovacuum settings for high-traffic tables
ALTER TABLE products SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);
```

### 4. Partition Large Tables

```sql
-- Partition transactional tables by date (if needed)
CREATE TABLE invoices_2026_01 PARTITION OF invoices
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

---

## Monitoring

### Key Metrics to Track

**1. Table Sizes**
```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

**2. Index Usage**
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

**3. Query Performance**
```sql
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
WHERE query LIKE '%products%'
ORDER BY mean_exec_time DESC
LIMIT 10;
```

---

## Security Considerations

### 1. RLS Verification

```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- All should show 't' (true)

-- Test RLS policy
SET ROLE test_user;
SET app.org_id = 'org_123';
SELECT * FROM products;
-- Should only return org_123's products
```

### 2. Permission Audit

```sql
-- Check table permissions
SELECT 
  grantee,
  table_name,
  privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
AND table_name IN ('products', 'customers', 'invoices');
```

### 3. Audit Log Configuration

```sql
-- Verify audit triggers exist
SELECT 
  trigger_name,
  event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE '%audit%';
```

---

## Success Criteria

### ✅ Migration Successful If:

- [ ] All 56 tables created
- [ ] All 168 indexes created
- [ ] All 56 RLS policies active
- [ ] No errors in migration log
- [ ] Sample queries return expected results
- [ ] Application connects successfully
- [ ] No performance degradation
- [ ] Backup completed successfully

### ❌ Migration Failed If:

- [ ] Any table creation failed
- [ ] Index creation errors
- [ ] RLS policy conflicts
- [ ] Application cannot connect
- [ ] Data integrity issues
- [ ] Performance significantly degraded

---

## Support

### Getting Help

**1. Check Logs:**
```bash
# View migration logs
tail -f logs/migration.log

# View Neon logs
# Navigate to: Neon Console → Your Project → Logs
```

**2. Community Support:**
- GitHub Issues: https://github.com/your-org/afena-nexus/issues
- Discord: https://discord.gg/afena-nexus
- Email: support@afena-nexus.com

**3. Emergency Rollback:**
```bash
# Immediate rollback
pnpm db:rollback

# Or restore from backup
# See "Rollback Procedure" section above
```

---

## Appendix

### A. Complete Table List

**Master Data (23):**
1. products
2. customers
3. suppliers
4. employees
5. warehouses
6. projects
7. cost_centers
8. leads
9. opportunities
10. service_tickets
11. boms
12. recipes
13. job_applications
14. crop_plans
15. livestock_records
16. legal_entities
17. contracts
18. documents
19. assets
20. fixed_assets
21. audit_programs
22. risk_assessments
23. sites (existing)

**Transactional Documents (28):**
1. invoices (existing)
2. payments (existing)
3. sales_orders (existing)
4. purchase_orders (existing)
5. goods_receipts (existing)
6. purchase_invoices (existing)
7. delivery_notes (existing)
8. quotations (existing)
9. journal_entries (existing)
10. expense_reports
11. leases
12. budgets
13. forecasts
14. purchase_requisitions
15. shipments
16. returns
17. inventory_transfers
18. campaigns
19. work_orders
20. quality_inspections
21. timesheets
22. leave_requests
23. performance_reviews
24. franchise_applications
25. outlet_audits

**Configuration (5):**
1. companies (existing)
2. currencies (existing)
3. uom (existing)
4. tax_codes
5. payment_terms

### B. Migration Timeline

**Estimated Duration:**
- Small database (<1GB): 5-10 minutes
- Medium database (1-10GB): 10-30 minutes
- Large database (>10GB): 30-60 minutes

**Downtime:**
- Zero downtime (tables created, not modified)
- Application can continue running
- New features available after migration

### C. Related Documentation

- [Schema Generation Documentation](../packages/database/SCHEMA_GENERATION.md)
- [Entity Registry Expansion](../packages/canon/ENTITY_REGISTRY_EXPANSION.md)
- [Database Architecture](./architecture/database.architecture.md)
- [CRUD Kernel Guide](../packages/crud/README.md)

---

**End of Migration Guide**
