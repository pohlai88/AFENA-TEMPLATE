# Database Reset Guide - Clean State Setup

**Purpose:** Reset your Neon database to a clean state and deploy v2.6 compliant schema  
**Date:** 2026-02-19  
**Status:** Production Ready

---

## Overview

This guide helps you reset your Neon database to a clean state and deploy the v2.6 architecture from scratch.

---

## Prerequisites

### Required
- Neon account with project access
- Database connection strings (pooled and direct)
- `pnpm` installed
- All dependencies installed (`pnpm install`)

### Environment Variables
```bash
# .env file
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:pass@host/db?sslmode=require
```

---

## Option 1: Reset Existing Database (Destructive)

### ⚠️ WARNING: This will delete ALL data

```sql
-- Connect to your database
psql $DATABASE_URL

-- Drop all tables in public schema
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Grant permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Verify clean state
\dt
-- Should show: "Did not find any relations."
```

---

## Option 2: Create New Neon Branch (Recommended)

### Using Neon Console
1. Go to https://console.neon.tech
2. Select your project
3. Click "Branches" → "Create Branch"
4. Name: `v2.6-clean-deploy`
5. Copy new connection strings
6. Update `.env` with new connection strings

### Using Neon CLI
```bash
# Install Neon CLI
npm install -g neonctl

# Create new branch
neonctl branches create --name v2.6-clean-deploy --project-id your-project-id

# Get connection string
neonctl connection-string v2.6-clean-deploy
```

---

## Step-by-Step Deployment

### 1. Verify Clean State

```bash
# Check database is empty
psql $DATABASE_URL -c "\dt"

# Should show no tables or "Did not find any relations"
```

### 2. Validate Package

```bash
cd packages/database

# Run all validations
pnpm db:validate-gates
pnpm db:validate-registry
pnpm type-check
pnpm lint
```

**Expected Output:**
```
✅ All gates PASSED (7/7)
✅ Registry validation PASSED
✅ Type check passed
✅ No lint errors
```

### 3. Run Migrations

```bash
# Apply all migrations
pnpm db:migrate
```

**What This Does:**
- Creates all 85 tables
- Sets up RLS policies
- Creates indexes (with CONCURRENTLY)
- Configures auth functions
- Sets up triggers

### 4. Verify Deployment

```bash
# Check tables created
psql $DATABASE_URL -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"

# Should show: 85 tables

# Check RLS enabled
psql $DATABASE_URL -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = false;"

# Should show: empty (all tables have RLS enabled)
```

### 5. Normalize Ownership

```bash
# Run ownership normalization
psql $DATABASE_URL -f scripts/normalize-ownership.sql
```

**Expected Output:**
```
✅ Ownership normalization complete: All objects owned by schema_owner
```

### 6. Verify Auth Context

```bash
# Test auth functions
psql $DATABASE_URL <<EOF
-- Set auth context
SELECT auth.set_context('550e8400-e29b-41d4-a716-446655440000', 'user123');

-- Verify context
SELECT auth.org_id(), auth.user_id();

-- Should return the values you set
EOF
```

---

## Post-Deployment Verification

### Check Table Count by Taxonomy

```sql
-- Connect to database
psql $DATABASE_URL

-- Count tables by type (based on naming patterns)
SELECT 
  CASE 
    WHEN tablename LIKE '%_versions' OR tablename LIKE 'audit_%' THEN 'evidence'
    WHEN tablename LIKE '%_outbox' OR tablename LIKE 'workflow_%' THEN 'control'
    WHEN tablename LIKE 'search_%' OR tablename LIKE '%_index' THEN 'projection'
    WHEN tablename IN ('user_roles', 'role_permissions', 'user_scopes', 'entity_attachments') THEN 'link'
    WHEN tablename IN ('users', 'roles', 'api_keys', 'legal_entities', 'org_usage_daily', 'r2_files') THEN 'system'
    ELSE 'truth'
  END as taxonomy,
  COUNT(*) as table_count
FROM pg_tables 
WHERE schemaname = 'public'
GROUP BY taxonomy
ORDER BY taxonomy;
```

**Expected Output:**
```
 taxonomy   | table_count 
------------+-------------
 control    |          24
 evidence   |           6
 link       |           4
 projection |           0  (created by workers)
 system     |           6
 truth      |          45
```

### Verify RLS Policies

```sql
-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname
LIMIT 10;
```

### Test DbSession API

```typescript
// Test in your application
import { createDbSession } from 'afenda-database';

const session = createDbSession({
  orgId: '550e8400-e29b-41d4-a716-446655440000',
  userId: 'user123'
});

// Test write
await session.rw(async (tx) => {
  const result = await tx.insert(contacts).values({
    orgId: '550e8400-e29b-41d4-a716-446655440000',
    id: crypto.randomUUID(),
    name: 'Test Contact',
    email: 'test@example.com'
  }).returning();
  
  console.log('Created:', result);
});

// Test read
await session.ro(async (tx) => {
  const contacts = await tx.select().from(contacts).limit(10);
  console.log('Contacts:', contacts);
});
```

---

## Troubleshooting

### Issue: Migration Fails

**Error:** `relation "..." already exists`

**Solution:**
```bash
# Database not clean - reset it
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
# Then re-run migrations
pnpm db:migrate
```

### Issue: RLS Denial Errors

**Error:** `new row violates row-level security policy`

**Solution:**
- Ensure you're using DbSession (not direct db access)
- Verify auth context is set
```typescript
const session = createDbSession({ orgId, userId });
await session.rw(tx => tx.insert(table).values(data));
```

### Issue: CONCURRENTLY Index Creation Fails

**Error:** `CREATE INDEX CONCURRENTLY cannot run inside a transaction block`

**Solution:**
- Metadata files should have `useTransaction: false`
- Check migrations 0017, 0019, 0021 have `.meta.json` files
- Re-run migration with correct metadata

### Issue: Auth Functions Not Found

**Error:** `function auth.org_id() does not exist`

**Solution:**
```sql
-- Create auth schema and functions
CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.org_id()
RETURNS text AS $$
  SELECT current_setting('app.org_id', true);
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION auth.user_id()
RETURNS text AS $$
  SELECT current_setting('app.user_id', true);
$$ LANGUAGE sql STABLE;
```

---

## Clean State Checklist

After deployment, verify:

- [ ] 85 tables exist in public schema
- [ ] All tables have RLS enabled
- [ ] Auth functions work (auth.org_id(), auth.user_id())
- [ ] All tables owned by schema_owner
- [ ] No migration errors in logs
- [ ] DbSession API works correctly
- [ ] All 7 gates pass validation
- [ ] No RLS denial errors in application

---

## Rollback Plan

If deployment fails:

### Option 1: Neon Branch Rollback
```bash
# Switch back to main branch
neonctl branches set-primary main --project-id your-project-id

# Delete failed branch
neonctl branches delete v2.6-clean-deploy --project-id your-project-id
```

### Option 2: Database Restore
```bash
# Restore from Neon backup (if available)
# Or re-run from clean state
```

---

## Next Steps After Clean Deployment

1. **Update Application Code**
   - Replace direct db imports with DbSession
   - Update all database operations
   - Test thoroughly

2. **Enable CI/CD**
   - GitHub Actions workflow is ready
   - Set DATABASE_URL secret
   - Enable branch protection

3. **Monitor Performance**
   - Check query performance
   - Monitor slow queries
   - Validate RLS overhead

4. **Documentation**
   - Update team documentation
   - Share migration guide
   - Train developers on DbSession API

---

## Production Deployment

Once verified in staging:

1. **Schedule Maintenance Window**
   - Notify users
   - Plan for downtime (if needed)

2. **Backup Production**
   ```bash
   # Neon automatic backups
   # Or manual backup
   pg_dump $DATABASE_URL > backup.sql
   ```

3. **Deploy to Production**
   - Use Neon branch promotion
   - Or run migrations on production
   - Monitor closely

4. **Verify Production**
   - Run all validation checks
   - Test critical paths
   - Monitor error rates

---

## Support

If you encounter issues:

1. Check `VALIDATION_REPORT.md` for gate status
2. Review `MIGRATION_GUIDE.md` for API changes
3. Check `CLEAN_DATABASE_SETUP.md` for deployment details
4. Review migration logs for errors

---

**Status:** ✅ Ready for Clean Deployment  
**Validation:** 7/7 Gates Passing  
**Compliance:** 100% v2.6 Architecture
