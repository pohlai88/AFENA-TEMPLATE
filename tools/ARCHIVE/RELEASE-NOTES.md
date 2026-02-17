# Quality Metrics v2.0 Release Notes

> **Database-backed quality enforcement with automated security scanning**

---

## 🎉 Overview

We're excited to announce **Quality Metrics v2.0**, a major upgrade to
AFENDA-NEXUS's quality management system. This release transforms quality
metrics from a tracking tool into a comprehensive quality enforcement platform
with database storage, automated gates, security scanning, and enhanced
visualizations.

**Release Date**: February 17, 2026\
**Version**: 2.0.0\
**Development Phase**: Sprints 0-2 Complete

---

## 🚀 What's New

### 1. Database-Backed Storage

Quality metrics are now stored in PostgreSQL, enabling powerful historical
analysis and trend tracking:

- **Persistent snapshots** - Every metric collection saved to database
- **Package-level data** - Detailed metrics for each workspace package
- **Historical trends** - Analyze quality evolution over time
- **Efficient queries** - Optimized indexes for fast data retrieval

**Migration**: Run `tools/quality-metrics/db/schema.sql` to set up tables.

```sql
-- New tables
quality_snapshots (21 columns, ~50 rows per day)
quality_package_metrics (10 columns, ~650 rows per day for 13 packages)
```

**Impact**: Enables trend analysis, regression detection, and data-driven
quality decisions.

---

### 2. Quality Gates System

Automated quality enforcement that blocks PRs failing to meet standards:

✅ **Absolute thresholds** - Minimum coverage, zero errors\
✅ **Regression detection** - Catches quality drops early\
✅ **Configurable rules** - Customize for your project needs\
✅ **CI integration** - Automatic enforcement on every PR

**Usage**:

```bash
# Run quality gates locally
pnpm --filter quality-metrics gates

# Configure thresholds
cat > .quality-gates.json <<EOF
{
  "minCoverageLines": 80,
  "maxCoverageDropPct": 2,
  "maxTypeErrors": 0
}
EOF
```

**Default Thresholds**:

- Coverage: 80% lines, functions, statements; 75% branches
- No type errors or lint errors allowed
- Max 2% coverage drop from baseline
- Max 20% build time increase

**Exit Codes**: Returns `0` on pass, `1` on failure (perfect for CI).

---

### 3. Security Scanning

Automated vulnerability detection using npm audit:

🔒 **Vulnerability scanning** - Detects known security issues\
🔒 **Severity-based blocking** - Fails on critical/high by default\
🔒 **Remediation guidance** - Provides fix instructions\
🔒 **CI integration** - Blocks PRs with vulnerabilities

**Usage**:

```bash
# Scan dependencies for vulnerabilities
pnpm --filter quality-metrics security

# Stricter: fail on moderate too
pnpm --filter quality-metrics security --fail-moderate

# Output formats: text (default), json, markdown
pnpm --filter quality-metrics security --format=json
```

**Severity Levels**:

- **Critical** (CVSS 9.0-10.0): ❌ Blocks PR
- **High** (CVSS 7.0-8.9): ❌ Blocks PR
- **Moderate** (CVSS 4.0-6.9): ⚠️ Warns
- **Low** (CVSS 0.1-3.9): ℹ️ Info

**Reports Include**:

- Package name and vulnerable version
- Vulnerability description and CVE link
- CVSS score and severity
- Fixed version and remediation steps

---

### 4. Enhanced Dashboard

Interactive quality visualization with charts and trends:

📊 **4 Trend Charts**: Coverage, Build Performance, Code Quality, Technical
Debt\
📊 **Package Drill-Down**: Metrics for each workspace package\
📊 **Trend Indicators**: Visual up/down/stable arrows\
📊 **Auto-Refresh**: Live updates every 30s

**Access**:

```bash
# Start development server
pnpm dev

# Visit dashboard
open http://localhost:3000/quality
```

**Charts**:

1. **Coverage Trends** - Line/function/statement/branch over time
2. **Build Performance** - Build time and bundle size trends
3. **Code Quality** - Type errors and lint issues
4. **Technical Debt** - Aggregated quality score (0-100)

**Features**:

- Recharts library for smooth animations
- Responsive design (desktop/mobile)
- Dark mode support
- Drill-down to package-specific metrics
- Historical data visualization (last 30+ snapshots)

---

### 5. Enhanced API Endpoints

Database-backed REST API for programmatic access:

```bash
# Get latest metrics
GET /api/quality/metrics

# Get historical data (last 30 snapshots)
GET /api/quality/history?limit=30

# Get trend analysis
GET /api/quality/trends

# Compare two snapshots
POST /api/quality/compare
{
  "baseId": 123,
  "compareId": 125
}
```

**Response Format** (JSON):

```json
{
  "id": 127,
  "timestamp": "2026-02-17T10:30:00Z",
  "coverage": {"lines": 85.2, "functions": 87.5, ...},
  "typeErrors": 0,
  "lintErrors": 0,
  "buildTimeMs": 42000,
  "packages": [
    {"name": "afenda-logger", "coverage": 92.1, ...}
  ]
}
```

---

### 6. CI/CD Integration

New GitHub Actions workflow for automated quality enforcement:

**Workflow**: `.github/workflows/quality-gates.yml`

**Triggers**:

- Every pull request
- Push to main/develop
- Manual dispatch
- Daily schedule (9 AM UTC)

**Steps**:

1. ✅ Install dependencies
2. ✅ Collect quality metrics
3. ✅ Run quality gates
4. ✅ Run security scan
5. ✅ Post PR comment with results
6. ❌ Fail if violations detected

**PR Comment Example**:

```markdown
## Quality Gates & Security Report

### 📊 Quality Gates: ✅ PASSED

**Summary**:

- Coverage: 85.2% lines ✅ (min: 80%)
- Type Errors: 0 ✅ (max: 0)
- Lint Errors: 0 ✅ (max: 0)

### 🔒 Security Scan: ✅ PASSED

**Summary**:

- Critical: 0 ✅
- High: 0 ✅
- Moderate: 2 ⚠️

[Full Report](#)
```

**Branch Protection**: Enable "Require status checks to pass" with
`quality-gates` check.

---

## 📚 Documentation

Comprehensive guides for all new features:

| Guide                                                              | Description                           | Audience               |
| ------------------------------------------------------------------ | ------------------------------------- | ---------------------- |
| [Quality Dashboard Guide](./docs/QUALITY-DASHBOARD-GUIDE.md)       | How to use the dashboard UI           | Developers, Team Leads |
| [Quality Gates Config Guide](./docs/QUALITY-GATES-CONFIG-GUIDE.md) | Configure quality thresholds          | DevOps, Tech Leads     |
| [Security Scanning Guide](./docs/SECURITY-SCANNING-GUIDE.md)       | Vulnerability detection & remediation | Security, Developers   |
| [Tools README](./README.md)                                        | Quick start and overview              | All                    |

**Total Documentation**: 1,800+ lines across 4 comprehensive guides.

---

## 🔄 Migration Guide

### For Existing Users

If you've been using the old quality metrics system:

#### 1. Database Setup

```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Run migration script
psql $DATABASE_URL -f tools/quality-metrics/db/schema.sql

# Verify tables created
psql $DATABASE_URL -c "\dt quality_*"
```

#### 2. Configure Quality Gates

```bash
# Create configuration file
cat > .quality-gates.json <<EOF
{
  "minCoverageLines": 80,
  "minCoverageFunctions": 80,
  "minCoverageStatements": 80,
  "minCoverageBranches": 75,
  "maxCoverageDropPct": 2,
  "maxBuildTimeIncreasePct": 20,
  "maxTypeErrors": 0,
  "maxLintErrors": 0,
  "maxLintWarnings": 10
}
EOF

# Test locally
pnpm --filter quality-metrics gates
```

#### 3. Update CI Workflow

```yaml
# Add to .github/workflows/ci.yml or create new workflow
- name: Quality Gates
  run: pnpm --filter quality-metrics gates

- name: Security Scan
  run: pnpm --filter quality-metrics security
```

#### 4. Enable Branch Protection

**GitHub Settings** → **Branches** → **Branch protection rules**:

- ✅ Require status checks to pass before merging
- ✅ Select `quality-gates` check
- ✅ Require branches to be up to date

### For New Users

```bash
# 1. Install dependencies
pnpm install

# 2. Set up database (optional, for historical tracking)
export DATABASE_URL="your-postgres-url"
psql $DATABASE_URL -f tools/quality-metrics/db/schema.sql

# 3. Collect metrics
pnpm --filter quality-metrics collect

# 4. Run quality checks
pnpm --filter quality-metrics gates
pnpm --filter quality-metrics security

# 5. View dashboard
pnpm dev
open http://localhost:3000/quality
```

---

## 💡 Common Workflows

### Developer: Check PR Quality Before Pushing

```bash
# Collect latest metrics
pnpm --filter quality-metrics collect

# Run quality gates
pnpm --filter quality-metrics gates

# Run security scan
pnpm --filter quality-metrics security

# If all pass ✅, push confidently
git push origin feature-branch
```

---

### Team Lead: Monitor Team Quality

```bash
# View dashboard
pnpm dev
# Visit http://localhost:3000/quality

# Check trends:
# - Is coverage improving or declining?
# - Are build times increasing?
# - Which packages need attention?

# Export report
curl http://localhost:3000/api/quality/metrics > report.json
```

---

### DevOps: Configure Quality Standards

```bash
# Adjust thresholds for your project
# Example: Strict project (financial, healthcare)
cat > .quality-gates.json <<EOF
{
  "minCoverageLines": 90,
  "minCoverageFunctions": 90,
  "minCoverageStatements": 90,
  "minCoverageBranches": 85,
  "maxCoverageDropPct": 1,
  "maxBuildTimeIncreasePct": 10,
  "maxTypeErrors": 0,
  "maxLintErrors": 0,
  "maxLintWarnings": 0
}
EOF

# Example: Legacy project (gradual improvement)
cat > .quality-gates.json <<EOF
{
  "minCoverageLines": 60,
  "minCoverageFunctions": 60,
  "minCoverageStatements": 60,
  "minCoverageBranches": 50,
  "maxCoverageDropPct": 5,
  "maxBuildTimeIncreasePct": 30,
  "maxTypeErrors": 5,
  "maxLintErrors": 10,
  "maxLintWarnings": 50
}
EOF
```

See
[Configuration Presets](./docs/QUALITY-GATES-CONFIG-GUIDE.md#customization-examples)
for more examples.

---

## 🐛 Breaking Changes

### Database Requirement (Optional)

Historical trend features now require PostgreSQL:

- **Affected**: `/api/quality/history`, `/api/quality/trends`, dashboard charts
- **Fallback**: Features gracefully degrade without `DATABASE_URL`
- **Migration**: Set `DATABASE_URL` and run schema.sql

### API Response Format

`/api/quality/metrics` now includes `packages` array:

**Before**:

```json
{
  "coverage": {...},
  "typeErrors": 0
}
```

**After**:

```json
{
  "coverage": {...},
  "typeErrors": 0,
  "packages": [
    {"name": "afenda-logger", "coverage": 92.1}
  ]
}
```

**Migration**: Update clients consuming this API to handle `packages` field.

### CI Workflow Changes

Old workflow used `quality:collect` + `quality:analyze`:

**Before**:

```yaml
- run: pnpm --filter quality-metrics collect
- run: pnpm --filter quality-metrics analyze
```

**After**:

```yaml
- run: pnpm --filter quality-metrics gates
- run: pnpm --filter quality-metrics security
```

**Migration**: Update workflows to use new `gates` and `security` commands.

---

## 🎯 Configuration Presets

Choose a preset based on your project type:

### Strict (Financial, Healthcare, Security-Critical)

```json
{
    "minCoverageLines": 90,
    "maxCoverageDropPct": 1,
    "maxTypeErrors": 0,
    "maxLintErrors": 0,
    "maxLintWarnings": 0
}
```

### Standard (Production Applications)

```json
{
    "minCoverageLines": 80,
    "maxCoverageDropPct": 2,
    "maxTypeErrors": 0,
    "maxLintErrors": 0,
    "maxLintWarnings": 10
}
```

### Relaxed (Legacy, Prototypes)

```json
{
    "minCoverageLines": 60,
    "maxCoverageDropPct": 5,
    "maxTypeErrors": 5,
    "maxLintErrors": 10,
    "maxLintWarnings": 50
}
```

### Library (npm packages)

```json
{
    "minCoverageLines": 95,
    "maxCoverageDropPct": 1,
    "maxTypeErrors": 0,
    "maxLintErrors": 0,
    "maxLintWarnings": 0
}
```

---

## 📈 What's Next

### Sprint 3: Advanced Analytics (Planned)

- Machine learning-based flakiness detection
- Predictive quality trends
- Cross-package dependency analysis
- Custom metric plugins

### Sprint 4: Polish & Documentation (In Progress)

- ✅ Comprehensive user guides
- ✅ Configuration documentation
- ✅ Security scanning guide
- 🔄 Video tutorials
- 🔄 Interactive examples

### Sprint 5: Developer Experience (Planned)

- VS Code extension for inline quality metrics
- GitHub App for automated PR reviews
- Slack/Discord notifications
- Quality badges for READMEs

---

## 🙋 Getting Help

### Documentation

- **Quick Start**: [tools/README.md](./README.md)
- **Dashboard Guide**:
  [docs/QUALITY-DASHBOARD-GUIDE.md](./docs/QUALITY-DASHBOARD-GUIDE.md)
- **Config Guide**:
  [docs/QUALITY-GATES-CONFIG-GUIDE.md](./docs/QUALITY-GATES-CONFIG-GUIDE.md)
- **Security Guide**:
  [docs/SECURITY-SCANNING-GUIDE.md](./docs/SECURITY-SCANNING-GUIDE.md)

### Troubleshooting

Common issues and solutions are documented in each guide:

- **Dashboard not loading**:
  [Dashboard Guide - Troubleshooting](./docs/QUALITY-DASHBOARD-GUIDE.md#troubleshooting)
- **Gates failing unexpectedly**:
  [Config Guide - Troubleshooting](./docs/QUALITY-GATES-CONFIG-GUIDE.md#troubleshooting)
- **Security scan errors**:
  [Security Guide - Troubleshooting](./docs/SECURITY-SCANNING-GUIDE.md#troubleshooting)

### Support

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions, share tips
- **Internal Team**: #quality-metrics Slack channel

---

## 👏 Contributors

This release was made possible by:

- Database schema design and migration
- Quality gates implementation with configurable thresholds
- Security scanning integration with npm audit
- Enhanced dashboard with Recharts visualizations
- CI/CD workflow automation
- Comprehensive documentation (1,800+ lines)

**Total Effort**: 3 Sprints (6 weeks)\
**Lines of Code**: 2,000+ (implementation + tests)\
**Documentation**: 1,800+ lines\
**Test Coverage**: 85%+

---

## 📝 Release Checklist

For maintainers deploying this release:

- [x] Database migrations tested in staging
- [x] Quality gates configured and tested
- [x] Security scanning integrated in CI
- [x] Dashboard deployed and accessible
- [x] Documentation reviewed and published
- [ ] Team training session scheduled
- [ ] Release announcement drafted
- [ ] Changelog updated
- [ ] Version tag created (`v2.0.0`)
- [ ] npm packages published (if applicable)

---

**Version**: 2.0.0\
**Release Date**: February 17, 2026\
**Status**: Released ✅

---

_For detailed technical changes, see [CHANGELOG.md](../CHANGELOG.md)._\
_For development plan, see
[TOOL-DEVELOPMENT-PLAN.md](./TOOL-DEVELOPMENT-PLAN.md)._
