# Deployment Checklist

Use this checklist to ensure all steps are completed before deploying.

## Pre-Deployment (T-24 hours)

- [ ] Review all merged PRs since last deployment
- [ ] Check for breaking changes in dependencies
- [ ] Verify database migration scripts
- [ ] Update version numbers in package.json
- [ ] Tag release in git: `git tag v1.x.x`
- [ ] Generate CHANGELOG entry
- [ ] Notify team of upcoming deployment

## Pre-Deployment (T-1 hour)

- [ ] Pull latest from main branch
- [ ] Run full test suite locally
- [ ] Build all packages successfully
- [ ] Check CI/CD pipeline status (all green)
- [ ] Verify environment variables in deployment platform
- [ ] Backup production database
- [ ] Review monitoring dashboards for baseline metrics

## Deployment Execution

- [ ] Deploy to staging environment
- [ ] Run smoke tests on staging
- [ ] Verify database migrations on staging
- [ ] Test critical user flows on staging
- [ ] Deploy to production
- [ ] Monitor deployment logs in real-time
- [ ] Verify health check endpoints

## Post-Deployment (T+15 minutes)

- [ ] Check application health metrics
- [ ] Verify no error spikes in logs
- [ ] Test critical user flows in production
- [ ] Check database connection pool status
- [ ] Verify API response times are normal
- [ ] Monitor memory and CPU usage
- [ ] Check for any failed background jobs

## Post-Deployment (T+1 hour)

- [ ] Review error tracking dashboard
- [ ] Check user feedback channels
- [ ] Verify analytics are tracking correctly
- [ ] Update deployment log/wiki
- [ ] Notify team of successful deployment
- [ ] Close deployment ticket

## Rollback Criteria

Initiate rollback immediately if:

- Error rate increases by >50%
- Critical functionality is broken
- Database integrity issues detected
- Performance degradation >30%
- Security vulnerability introduced

## Emergency Contacts

- On-call engineer: [Contact info]
- Database admin: [Contact info]
- DevOps lead: [Contact info]
- Product manager: [Contact info]
