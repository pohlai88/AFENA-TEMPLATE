# Rollback Procedure

Follow this procedure if deployment issues are detected.

## When to Rollback

Initiate rollback if you observe:

- **Critical bugs** affecting core functionality
- **Error rate spike** (>50% increase)
- **Performance degradation** (>30% slower response times)
- **Database issues** (connection failures, data corruption)
- **Security vulnerabilities** introduced
- **User-facing breakage** reported by multiple users

## Rollback Steps

### 1. Assess the Situation (5 minutes)

- [ ] Identify the specific issue
- [ ] Check error logs and monitoring
- [ ] Determine impact scope (all users vs. subset)
- [ ] Notify team in deployment channel

### 2. Initiate Rollback (10 minutes)

```bash
# Option 1: Automated rollback
pnpm deploy:rollback

# Option 2: Manual rollback to specific version
pnpm deploy:rollback --version v1.2.3

# Option 3: Vercel/Netlify dashboard
# Use platform UI to rollback to previous deployment
```

### 3. Database Rollback (if needed)

**⚠️ CAUTION: Only if migrations were applied**

```bash
# Rollback last migration
pnpm db:migrate:rollback

# Rollback to specific migration
pnpm db:migrate:rollback --to 0042
```

**Important**: Coordinate with database admin before rolling back migrations.

### 4. Verify Rollback Success (5 minutes)

- [ ] Check application version in UI footer
- [ ] Verify health check endpoint
- [ ] Test critical user flows
- [ ] Check error rate has normalized
- [ ] Verify database connections stable
- [ ] Monitor for 10 minutes to ensure stability

### 5. Communication (Immediate)

- [ ] Update status page if applicable
- [ ] Notify users via appropriate channels
- [ ] Post incident update in team chat
- [ ] Update deployment ticket with rollback details

## Post-Rollback Actions

### Immediate (T+30 minutes)

- [ ] Collect error logs and stack traces
- [ ] Document what went wrong
- [ ] Create incident ticket
- [ ] Schedule post-mortem meeting

### Short-term (T+24 hours)

- [ ] Conduct post-mortem with team
- [ ] Identify root cause
- [ ] Create action items to prevent recurrence
- [ ] Update deployment checklist if needed
- [ ] Plan fix and re-deployment

### Long-term

- [ ] Implement additional safeguards
- [ ] Update monitoring/alerting rules
- [ ] Enhance testing coverage
- [ ] Document lessons learned

## Rollback Verification Checklist

After rollback, verify:

- [ ] Application responds to requests
- [ ] No 500 errors in logs
- [ ] Database queries executing normally
- [ ] Authentication/authorization working
- [ ] Critical API endpoints functional
- [ ] Background jobs processing
- [ ] Cache invalidation successful
- [ ] CDN serving correct version

## Emergency Escalation

If rollback fails or issues persist:

1. **Escalate to senior engineer** immediately
2. **Contact database admin** if DB issues
3. **Engage platform support** (Vercel/Netlify/AWS)
4. **Consider maintenance mode** if critical

## Rollback Decision Matrix

| Issue Severity | User Impact | Action |
|---------------|-------------|--------|
| Critical | >50% users | Immediate rollback |
| High | 10-50% users | Rollback within 15 min |
| Medium | <10% users | Assess, may rollback |
| Low | Minimal | Fix forward, no rollback |

## Notes

- Always prefer rollback over attempting live fixes
- Document every step taken during rollback
- Keep communication channels open
- Don't rush - follow procedure carefully
- Learn from incidents to improve process
