# @afenda-regulatory-reporting

Enterprise regulatory compliance and reporting.

## Purpose

Layer 2 domain package providing SOX compliance, audit trail management,
compliance reporting, regulatory filings, and compliance analytics.

## Architecture

- **Layer:** 2 (Domain Services)
- **Dependencies:** afenda-canon (Layer 1), afenda-database (Layer 1)
- **Consumers:** Compliance application layer
- **Pattern:** Pure domain functions, no logging, Zod validation

## Services

### sox-compliance.ts

- `performSOXControl` - Execute SOX control test
- `certifySOXCompliance` - Certify SOX compliance

### audit-trails.ts

- `logAuditEvent` - Log audit event
- `queryAuditTrail` - Query audit history

### compliance-management.ts

- `createComplianceTask` - Create compliance task
- `trackComplianceStatus` - Track compliance status

### regulatory-filings.ts

- `generateRegulatoryFiling` - Generate regulatory filing
- `submitFiling` - Submit filing to authority

### compliance-analytics.ts

- `analyzeComplianceRisk` - Analyze compliance risks
- `generateComplianceScore` - Calculate compliance score

## Usage

```typescript
import { performSOXControl } from 'afenda-regulatory-reporting';

const result = await performSOXControl(db, orgId, {
  controlId: 'SOX-ITGC-001',
  testDate: new Date(),
  testerId: 'auditor-123',
  evidence: 'access-review-report.pdf',
});
```

## Business Value

- SOX compliance automation
- Complete audit trail coverage
- Regulatory filing preparation
- Compliance risk monitoring
- Audit readiness tracking
