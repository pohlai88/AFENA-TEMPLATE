---
name: example-deployment
description: Example skill showing how to create deployment workflows with safety checks and rollback procedures
---

# Deployment Workflow Example

This is an example skill demonstrating the structure and format for Windsurf skills.

## Pre-deployment Checklist

Before deploying to production, ensure:

1. **Tests Pass**
   - Run full test suite: `pnpm test`
   - Verify E2E tests: `pnpm test:e2e`
   - Check type safety: `pnpm type-check`

2. **Code Quality**
   - Lint passes: `pnpm lint`
   - No uncommitted changes: `git status`
   - Branch is up to date with main

3. **Environment Verification**
   - Environment variables are set correctly
   - Database migrations are ready
   - API keys and secrets are configured

4. **Documentation**
   - CHANGELOG.md is updated
   - README.md reflects new features
   - API documentation is current

## Deployment Steps

### 1. Build Verification

```bash
pnpm build
```

Ensure all packages build successfully without errors.

### 2. Database Migrations

```bash
pnpm db:migrate
```

Verify migrations apply cleanly to production database.

### 3. Deploy to Staging

```bash
pnpm deploy:staging
```

Test thoroughly on staging environment before production.

### 4. Production Deployment

```bash
pnpm deploy:production
```

Monitor deployment logs for any errors.

### 5. Post-Deployment Verification

- [ ] Health check endpoint responds: `/api/health`
- [ ] Critical user flows work correctly
- [ ] No error spikes in monitoring
- [ ] Database connections are stable

## Rollback Procedure

If issues are detected after deployment:

1. **Immediate Rollback**

   ```bash
   pnpm deploy:rollback
   ```

2. **Verify Rollback Success**
   - Check application version
   - Test critical functionality
   - Review error logs

3. **Post-Mortem**
   - Document what went wrong
   - Update deployment checklist
   - Plan fixes for next deployment

## Supporting Resources

See additional files in this directory:

- `deployment-checklist.md` - Detailed checklist
- `rollback-procedure.md` - Step-by-step rollback guide
- `monitoring-dashboard.md` - Links to monitoring tools

## Notes

- Always deploy during low-traffic hours
- Have at least one team member available for support
- Keep communication channels open during deployment
- Document any deviations from standard procedure
