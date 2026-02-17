# GitHub Actions Integration - DEFERRED

**Status**: Implementation deferred for separate PR  
**Sprint**: Sprint 6  
**Date**: February 17, 2026  
**Reason**: Requires webhook secrets configuration and production environment setup

## Overview

The following GitHub Actions workflow integrations were planned but deferred to allow for proper secret configuration and testing in a production environment.

## Planned Integrations

### 1. Enhanced PR Comments

**Script**: `tools/scripts/generate-pr-comment.ts`  
**Status**: ✅ Script implemented and tested  
**Integration**: ❌ Not integrated into workflow

**Required Workflow Updates** (`.github/workflows/quality-gates.yml`):

```yaml
# Replace lines 119-150 with:
- name: Generate Enhanced PR Comment
  if: github.event_name == 'pull_request'
  run: |
    pnpm quality:pr-comment \
      --sha=${{ github.event.pull_request.head.sha }} \
      --base=${{ github.event.pull_request.base.sha }} \
      --output=pr-comment-enhanced.md

- name: Post PR Comment
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
  with:
    script: |
      const fs = require('fs');
      const comment = fs.readFileSync('pr-comment-enhanced.md', 'utf-8');
      
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: comment
      });
```

### 2. Badge Auto-Update

**Script**: `tools/scripts/generate-badges.ts`  
**Status**: ✅ Script implemented and tested  
**Integration**: ❌ Not integrated into workflow

**Required Workflow Updates**:

```yaml
- name: Update Quality Badges
  if: github.ref == 'refs/heads/main'
  run: pnpm quality:badges:update

- name: Commit Badge Updates
  if: github.ref == 'refs/heads/main'
  uses: stefanzweifel/git-auto-commit-action@v4
  with:
    commit_message: "chore: update quality badges [skip ci]"
    file_pattern: README.md
```

### 3. Team Notifications

**Script**: `tools/scripts/notify-team.ts`  
**Status**: ✅ Script implemented and tested  
**Integration**: ❌ Not integrated into workflow

**Required Secrets** (Must be configured in GitHub repository settings):
- `SLACK_WEBHOOK_URL` - Slack incoming webhook URL
- `DISCORD_WEBHOOK_URL` - Discord webhook URL (optional)
- `TEAMS_WEBHOOK_URL` - Microsoft Teams webhook URL (optional)

**Required Workflow Updates**:

```yaml
- name: Notify Team on Failure
  if: failure() && github.event_name == 'pull_request'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
    DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
    TEAMS_WEBHOOK_URL: ${{ secrets.TEAMS_WEBHOOK_URL }}
  run: |
    pnpm quality:notify --severity=critical

- name: Daily Quality Digest
  if: github.event_name == 'schedule'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
  run: |
    pnpm quality:notify --mode=digest
```

**Required Schedule Trigger** (add to workflow triggers):

```yaml
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: '0 9 * * 1-5'  # 9 AM weekdays for daily digest
```

### 4. Badge API Deployment

**Endpoint**: `apps/web/app/api/badges/[metric]/route.ts`  
**Status**: ✅ API implemented  
**Integration**: ❌ Not deployed

**Required Actions**:
1. Deploy Next.js app to Vercel/production
2. Update README badge URLs to use new endpoint:
   ```markdown
   ![Coverage](https://your-app.vercel.app/api/badges/coverage)
   ![Build](https://your-app.vercel.app/api/badges/build-time)
   ![Quality](https://your-app.vercel.app/api/badges/quality-score)
   ```

## Configuration Files

### .quality-notifications.json

Create this file in repository root with team webhook URLs:

```json
{
  "channels": {
    "slack": {
      "webhookUrl": "${SLACK_WEBHOOK_URL}",
      "enabled": true
    },
    "discord": {
      "webhookUrl": "${DISCORD_WEBHOOK_URL}",
      "enabled": false
    },
    "teams": {
      "webhookUrl": "${TEAMS_WEBHOOK_URL}",
      "enabled": false
    }
  },
  "filters": {
    "minSeverity": "warning",
    "ignoredChecks": []
  },
  "digest": {
    "enabled": true,
    "schedule": "daily",
    "includeSuccesses": true
  }
}
```

**Note**: Use environment variables (`${VAR_NAME}`) for webhook URLs to avoid committing secrets.

## Dependencies

All required dependencies are already installed:
- ✅ `@slack/webhook` - Slack integration
- ✅ No additional packages for Discord/Teams (using fetch API)
- ✅ `@actions/github-script@v7` - Already in workflow

## Testing Requirements

Before integration, the following should be tested:

1. **PR Comment Generation**
   - [ ] Test with various quality score ranges
   - [ ] Verify Mermaid chart rendering in GitHub
   - [ ] Test comparison with baseline metrics

2. **Team Notifications**
   - [ ] Test Slack webhook integration
   - [ ] Test Discord webhook integration
   - [ ] Test Teams webhook integration
   - [ ] Verify message formatting in each channel

3. **Badge Generation**
   - [ ] Test badge SVG rendering
   - [ ] Test badge URL generation
   - [ ] Test README auto-update
   - [ ] Verify CDN caching headers

4. **Database Integration**
   - [ ] Test plugin metric storage
   - [ ] Verify historical data retrieval
   - [ ] Test trend calculation
   - [ ] Test cleanup job

## Integration Checklist

When ready to integrate:

- [ ] Configure webhook secrets in GitHub repository settings
- [ ] Create `.quality-notifications.json` in repository root
- [ ] Update `.github/workflows/quality-gates.yml` with new steps
- [ ] Add schedule trigger for daily digest
- [ ] Deploy Next.js app to production
- [ ] Update README badge URLs
- [ ] Run migration for `quality_plugin_metrics` table
- [ ] Test full workflow end-to-end
- [ ] Update documentation with production URLs

## Rollback Plan

If integration causes issues:

1. Remove new workflow steps
2. Restore original PR comment step (lines 119-150)
3. Disable notifications in `.quality-notifications.json`
4. Revert README badge URLs to shields.io

## Timeline

**Estimated Effort**: 2-3 hours  
**Prerequisites**:
- Production deployment environment
- Team webhook URLs from Slack/Discord/Teams
- Database migration applied

**Suggested Timeline**:
1. **Week 1**: Configure secrets and test webhooks locally
2. **Week 2**: Update workflow and test in feature branch
3. **Week 3**: Deploy to production and monitor

## Related Files

- `.github/workflows/quality-gates.yml` - Main quality workflow
- `tools/scripts/generate-pr-comment.ts` - PR comment script
- `tools/scripts/generate-badges.ts` - Badge generation script
- `tools/scripts/notify-team.ts` - Team notification script
- `.quality-notifications.example.json` - Configuration template

## Contact

For questions or assistance with integration:
- Review Sprint 6 completion report: `tools/SPRINT-6-COMPLETE.md`
- Check plugin documentation: `tools/README.md` (Sprint 6 section)

---

**Last Updated**: February 17, 2026  
**Review Date**: March 1, 2026
