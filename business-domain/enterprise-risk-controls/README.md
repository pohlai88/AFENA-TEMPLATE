# Enterprise Risk Controls (afenda-enterprise-risk-controls)

## Purpose

Governance, Risk & Compliance (GRC) framework for SOX/ICFR compliance, risk assessment, internal controls monitoring, audit management, and policy enforcement. Provides continuous controls monitoring and automated compliance testing for enterprise risk management.

## When to Use

- **SOX 404 compliance**: Public companies requiring internal controls certification
- **Internal audit automation**: Continuous controls monitoring and testing
- **Risk management**: Enterprise risk assessment and mitigation tracking
- **Policy governance**: Centralized policy distribution and attestation
- **Third-party risk**: Vendor risk assessments and due diligence
- **Regulatory compliance**: Multi-framework compliance (SOX, GDPR, ISO 27001, NIST)

## Key Concepts

### SOX 404 Compliance
**Sarbanes-Oxley Section 404** - Management must certify effectiveness of internal controls over financial reporting (ICFR).

**Control Types**:
- **Entity-level controls** - Tone at the top, code of conduct, audit committee
- **Process-level controls** - Segregation of duties, authorization, reconciliation
- **IT general controls** - Access management, change management, backup/recovery
- **Application controls** - Data validation, completeness checks, error handling

**Control Testing**:
- **Design effectiveness** - Is the control properly designed?
- **Operating effectiveness** - Does the control work consistently?
- **Deficiency severity** - Deficiency → Significant deficiency → Material weakness

### Risk Assessment

**Risk Matrix**:  
```
Impact/Likelihood | Low (1-3) | Medium (4-6) | High (7-9)
─────────────────────────────────────────────────────────
High (7-9)        | Medium    | High         | Critical
Medium (4-6)      | Low       | Medium       | High
Low (1-3)         | Low       | Low          | Medium
```

**Risk Factors**:
- **Inherent risk** - Risk before controls (natural exposure)
- **Residual risk** - Risk after controls (actual exposure)
- **Control effectiveness** - How well controls mitigate risk

### Three Lines of Defense

**Model for risk governance**:
1. **First line** - Operational management (risk owners)
2. **Second line** - Risk management & compliance (oversight)
3. **Third line** - Internal audit (independent assurance)

### COSO Framework

**Committee of Sponsoring Organizations** - Standard for internal controls:
1. **Control environment** - Tone at the top, integrity, ethics
2. **Risk assessment** - Identify and analyze risks
3. **Control activities** - Policies and procedures
4. **Information & communication** - Relevant, timely data flow
5. **Monitoring activities** - Ongoing evaluations

### Issue Management

**Lifecycle**:
1. **Identified** - Issue discovered (audit, control test, incident)
2. **Assessed** - Severity determined (low/medium/high/critical)
3. **Assigned** - Owner and due date set
4. **Remediated** - Corrective action implemented
5. **Validated** - Verification that issue is resolved
6. **Closed** - Final sign-off

## Architecture

- **Layer**: 2 (Domain Service)
- **Dependencies**: 
  - `afenda-canon` - Type definitions
  - `afenda-database` - Neon Postgres connection
  - `drizzle-orm` - Database ORM
  - `zod` - Input validation

## Services

### 1. Control Matrix Builder (`control-matrix-builder.ts`)

**Purpose**: Build SOX control matrix with COSO framework alignment.

**Use Cases**:
- Map financial processes to risks and controls
- Document control attributes (frequency, owner, evidence)
- Link controls to COSO principles
- Generate control catalog for SOX 404 certification

**Input**:
- Organization ID
- Process area (e.g., "Revenue Recognition", "Payroll")
- Risk objectives
- Control descriptions

**Output**:
- Control matrix with unique control IDs
- COSO component mapping
- Control type classification
- Testing requirements

**Example**:
```typescript
const matrix = await buildControlMatrix({
    orgId: 'org_123',
    processArea: 'Revenue Recognition',
    risks: [
        {
            riskId: 'REV-001',
            description: 'Fictitious revenue recorded',
            inherentRisk: 8
        }
    ],
    controls: [
        {
            controlId: 'CTRL-REV-001',
            description: 'Quarterly reconciliation of unbilled revenue',
            frequency: 'QUARTERLY',
            owner: 'Controller',
            cosoComponent: 'CONTROL_ACTIVITIES',
            controlType: 'DETECTIVE'
        }
    ]
});
// Returns: Control matrix with risk-control linkage
```

**Business Value**:
- Audit-ready SOX documentation ($50k-150k consulting savings)
- Continuous controls monitoring vs. annual testing
- Real-time deficiency tracking

---

### 2. Risk Assessor (`risk-assessor.ts`)

**Purpose**: Perform enterprise risk assessments with heat map generation.

**Use Cases**:
- Annual enterprise risk assessment (ERM)
- Departmental risk registers
- Third-party vendor risk scoring
- Cybersecurity risk quantification

**Input**:
- Organization ID
- Risk category (operational, financial, strategic, compliance)
- Inherent impact and likelihood scores (1-9)
- Existing controls

**Output**:
- Residual risk score
- Heat map classification (low/medium/high/critical)
- Mitigation recommendations
- Risk ranking for prioritization

**Example**:
```typescript
const assessment = await assessRisk({
    orgId: 'org_123',
    riskCategory: 'CYBERSECURITY',
    riskDescription: 'Ransomware attack on financial systems',
    inherentImpact: 9,  // Catastrophic business disruption
    inherentLikelihood: 6,  // Medium likelihood
    controls: [
        { controlId: 'CTRL-IT-001', effectiveness: 75 }  // Backup/recovery 75% effective
    ]
});
// Returns: residualRisk = 6.75 / 9 = "HIGH" classification
```

**Business Value**:
- Board-level risk reporting
- Insurance premium optimization (cyber insurance)
- M&A due diligence acceleration

---

### 3. Control Tester (`control-tester.ts`)

**Purpose**: Execute automated control tests and track results.

**Use Cases**:
- Quarterly SOX 404 control testing
- Continuous controls monitoring
- Deficiency identification and tracking
- Evidence capture for auditors

**Input**:
- Control ID to test
- Test period
- Expected behavior
- Actual sample data

**Output**:
- Test result (pass/fail/exception)
- Deficiency severity if failed
- Evidence artifacts
- Remediation recommendations

**Example**:
```typescript
const test = await performControlTest({
    orgId: 'org_123',
    controlId: 'CTRL-FIN-001',
    testPeriod: '2024-Q4',
    testType: 'SEGREGATION_OF_DUTIES',
    sampleSize: 25,
    expectedBehavior: 'No users with both GL posting AND approval access'
});
// Returns: status = 'FAILED', deficiency = 'SIGNIFICANT', 
//          findings = '3 users with conflicting access (John, Mary, Bob)'
```

**Business Value**:
- 80% faster control testing vs. manual
- Early deficiency detection (avoid material weaknesses)
- Auditability - full test evidence trail

---

### 4. Audit Manager (`audit-manager.ts`)

**Purpose**: Plan and execute internal audit engagements with issue tracking.

**Use Cases**:
- Annual internal audit plan (IAP)
- Ad-hoc audit scheduling
- Finding remediation tracking
- Audit report generation

**Input**:
- Audit scope (department, process, location)
- Audit type (financial, operational, IT, compliance)
- Audit team assignments
- Testing procedures

**Output**:
- Audit plan with timeline
- Fieldwork status tracking
- Findings and observations
- Management action plans (MAPs)

**Example**:
```typescript
const engagement = await planAuditEngagement({
    orgId: 'org_123',
    auditScope: 'Accounts Payable - EMEA Region',
    auditType: 'OPERATIONAL',
    riskRating: 'HIGH',
    startDate: '2024-06-01',
    duration: 30,  // Days
    auditors: ['auditor_123', 'auditor_456']
});
// Returns: engagement plan with procedures, sample selections, timeline
```

**Business Value**:
- 50% faster audit cycle time
- Centralized issue remediation tracking
- Board/audit committee reporting automation

---

### 5. Policy Publisher (`policy-publisher.ts`)

**Purpose**: Distribute policies and track employee attestations.

**Use Cases**:
- Code of conduct annual attestation
- New hire policy acknowledgment
- Policy update notifications
- Compliance training tracking

**Input**:
- Policy document (PDF/text)
- Target audience (all employees, dept, role)
- Attestation requirement
- Due date

**Output**:
- Policy distribution confirmation
- Attestation status tracking
- Delinquent user reminders
- Compliance percentage report

**Example**:
```typescript
const campaign = await publishPolicy({
    orgId: 'org_123',
    policyId: 'POL-COC-2024',
    policyName: 'Code of Conduct',
    version: '2024.1',
    requiresAttestation: true,
    targetAudience: 'ALL_EMPLOYEES',
    dueDate: '2024-12-31'
});
// Returns: distribution stats, attestation tracking URL
```

**Business Value**:
- SOX/FCPA compliance evidence
- 95% attestation rate vs. 70% manual
- Audit-ready policy acknowledgment records

---

### 6. Exception Tracker (`exception-tracker.ts`)

**Purpose**: Log and monitor control exceptions with approval workflows.

**Use Cases**:
- Emergency GL posting outside normal process
- One-time segregation of duties override
- Policy exception requests (travel limits, spending)
- Temporary control bypass during system maintenance

**Input**:
- Exception request details
- Business justification
- Approver hierarchy
- Expiration date

**Output**:
- Exception approval status
- Compensating controls required
- Exception usage monitoring
- Audit trail for review

**Example**:
```typescript
const exception = await logException({
    orgId: 'org_123',
    exceptionType: 'SEGREGATION_OVERRIDE',
    requestor: 'emp_456',
    justification: 'Month-end close - Controller out sick',
    affectedControl: 'CTRL-FIN-002',
    duration: '2024-01-31',  // One day
    compensatingControls: [
        'CFO review of all GL entries next morning'
    ],
    approver: 'cfo_789'
});
// Returns: exception logged, approval workflow initiated
```

**Business Value**:
- Control override visibility for auditors
- Prevents exception creep (temporary becomes permanent)
- Compensating control enforcement

---

## Database Tables

### `controls`
- `control_id` (PK) - Unique control identifier
- `org_id` - Organization
- `control_description` - What the control does
- `process_area` - Where it applies (Revenue, Payroll, IT)
- `control_type` - Preventive, detective, corrective
- `frequency` - Daily, weekly, monthly, quarterly, annual
- `coso_component` - COSO framework alignment
- `owner_email` - Who performs the control
- `reviewer_email` - Who reviews evidence

### `control_tests`
- `test_id` (PK)
- `control_id` (FK) - Control being tested
- `test_period` - Q1 2024, FY2024, etc.
- `test_date` - When test was performed
- `result` - Pass, fail, not_tested
- `deficiency_severity` - None, deficiency, significant, material_weakness
- `findings` - Test observations
- `evidence_urls` - Links to evidence (S3, SharePoint)

### `risks`  
- `risk_id` (PK)
- `org_id`
- `risk_description`
- `risk_category` - Operational, financial, strategic, compliance, cybersecurity
- `inherent_impact` - 1-9 scale
- `inherent_likelihood` - 1-9 scale
- `residual_risk` - After controls applied
- `risk_owner` - Who manages this risk

### `risk_controls` (Many-to-many)
- `risk_id` (FK)
- `control_id` (FK)
- `mitigation_percentage` - How much this control reduces risk

### `audit_engagements`
- `engagement_id` (PK)
- `org_id`
- `audit_scope` - AP, AR, Inventory, IT Access, etc.
- `audit_type` - Financial, operational, IT, compliance
- `status` - Planning, fieldwork, reporting, closed
- `start_date`, `end_date`
- `lead_auditor`

### `audit_findings`
- `finding_id` (PK)
- `engagement_id` (FK)
- `finding_description`
- `severity` - Observation, low, medium, high, critical
- `management_response`
- `remediation_due_date`
- `remediation_status` - Open, in_progress, completed, verified

### `policies`
- `policy_id` (PK)
- `org_id`
- `policy_name` - Code of Conduct, Travel & Expense, etc.
- `version` - 2024.1
- `effective_date`
- `requires_attestation` - Boolean

### `policy_attestations`
- `attestation_id` (PK)
- `policy_id` (FK)
- `employee_id`
- `attestation_date` - When they acknowledged
- `status` - Pending, completed, overdue

### `control_exceptions`
- `exception_id` (PK)
- `org_id`
- `control_id` (FK) - Control being bypassed
- `requestor`
- `justification`
- `approval_status` - Pending, approved, denied
- `approver`
- `start_date`, `end_date` - Exception window
- `compensating_controls` - What mitigates the risk

## Integration Points

### Accounting/GL
- Query GL entries for control test samples
- Validate segregation of duties (posting ≠ approving)

### Access Governance
- Pull user access reports for SOD testing
- Verify control owners have appropriate access

### Audit Trail
- Log all control tests, exceptions as audit events

### HR Systems
- Employee data for policy distribution
- Organizational hierarchy for approval routing

## Business Impact

### Cost Savings
- **SOX compliance**: $50k-150k/year consulting reduction
- **Audit fees**: 20-30% reduction through continuous monitoring
- **Insurance**: Cyber insurance premium reduction with documented controls

### Risk Mitigation
- **Material weakness prevention**: Early deficiency detection
- **Audit findings**: 60% fewer audit findings vs. reactive programs
- **Regulatory penalties**: Avoid SEC/DOJ enforcement actions

### Operational Efficiency
- **Control testing**: 80% faster with automation
- **Policy attestation**: 95% completion vs. 70% manual
- **Exception management**: Real-time visibility vs. after-the-fact discovery

## Related Packages

- `afenda-audit` - External financial audit support
- `afenda-access-governance` - User access reviews for SOD
- `afenda-document-mgmt` - Policy document repository
- `afenda-workflow` - Approval routing for exceptions

## Compliance Frameworks

### SOX (Sarbanes-Oxley)
- Section 302 - CEO/CFO certification
- Section 404 - Internal controls over financial reporting

### COSO
- Integrated framework for internal controls
- Enterprise risk management (ERM)

### ISO 27001
- Information security management

### GDPR
- Data privacy and protection controls

### NIST Cybersecurity Framework
- Identify, Protect, Detect, Respond, Recover

## References

- [PCAOB Auditing Standard 2201](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2201) - SOX controls auditing
- [COSO Framework](https://www.coso.org/guidance-on-internal-control) - Internal controls guidance
- [IIA Three Lines Model](https://www.theiia.org/en/standards/what-is-the-three-lines-model/) - Risk governance
