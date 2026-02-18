# Data Governance (afenda-data-governance)

## Purpose

Enterprise data governance framework with data quality monitoring, lineage tracking, metadata management, master data stewardship, and data classification. Ensures trusted data through automated quality checks and complete audit trails for regulatory compliance (GDPR, BCBS 239, SOX).

## When to Use

- **Enterprise data quality**: Automated DQ monitoring for critical business data
- **Regulatory compliance**: GDPR data lineage, BCBS 239 data aggregation, SOX data controls
- **Master data management**: Golden record creation, stewardship workflows, duplicate detection
- **Data privacy**: PII/PHI classification, retention policies, right-to-be-forgotten
- **Analytics trust**: Data lineage from source → transformation → reporting
- **Mergers & acquisitions**: Data due diligence, schema consolidation, quality assessment

## Key Concepts

### Data Quality Dimensions

**Accuracy** - Does the data correctly represent reality?  
- Example: Customer address matches USPS database

**Completeness** - Are all required fields populated?  
- Example: 95% of customer records have email addresses

**Consistency** - Is data uniform across systems?  
- Example: Same customer ID in CRM and billing system

**Timeliness** - Is data current and updated regularly?  
- Example: Inventory updated within 5 minutes of sale

**Validity** - Does data conform to business rules?  
- Example: Product price > $0, SKU format matches pattern

**Uniqueness** - No duplicate records exist  
- Example: One customer record per person (no duplicates)

### Data Lineage

**Purpose**: Track data flow from source to consumption  
```
Source System → ETL/Transform → Data Warehouse → BI Report
   ERP.orders → Fivetran →   DWH.fact_orders → Tableau Sales Dashboard
```

**Use Cases**:
- **Impact analysis**: "If I change this field, what breaks?"
- **Root cause analysis**: "Why is this report wrong?"
- **Compliance**: GDPR Article 30 (data processing records)
- **Audit trail**: Prove data was not manipulated

### Data Classification

**Tiers**:
- **Public** - Freely shareable (marketing materials)
- **Internal** - Employees only (company policies)
- **Confidential** - Restricted access (financial statements)
- **Restricted** - Highest security (PII, PHI, PCI)

**Regulations**:
- **GDPR** - Personal data (name, email, IP address)
- **HIPAA** - Protected health information (PHI)
- **PCI DSS** - Cardholder data (credit card numbers)
- **GLBA** - Nonpublic personal information (NPI) for financial services

### Master Data Management (MDM)

**Golden Record**: Single source of truth created from multiple systems  
```
CRM System:     John Smith, john.smith@acme.com, 555-1234
Billing System: J. Smith, jsmith@acme.com, 555-1234
ERP System:     Smith, John, johnsmith@acme.com, (555) 123-4567

Golden Record:  John Smith, john.smith@acme.com, +1-555-123-4567
                (Authoritative, deduplicated, validated)
```

**Matching Rules**:
- **Exact match** - 100% field agreement
- **Fuzzy match** - Similar values (Levenshtein distance, soundex)
- **Probabilistic** - Weighted scoring across multiple fields

### Data Stewardship

**Roles**:
- **Data owner** - Business accountability (VP of Sales owns customer data)
- **Data steward** - Day-to-day management (Customer master steward)
- **Data custodian** - Technical implementation (Database admin)

**Responsibilities**:
- Define data quality rules
-Approve data changes
- Resolve data conflicts
- Monitor data quality metrics
- Enforce retention policies

### BCBS 239 (Banking)

**Principles of Effective Risk Data Aggregation**:
1. **Governance** - Clear data ownership
2. **Architecture** - Firm-wide data framework
3. **Accuracy & Integrity** - Reconciliation, validation
4. **Completeness** - Cover all risk exposures
5. **Timeliness** - Timely risk reporting
6. **Adaptability** - Flexible for new requirements

**Applies to**: Global systemically important banks (G-SIBs)

## Architecture

- **Layer**: 2 (Domain Service)
- **Dependencies**: 
  - `afenda-canon` - Type definitions
  - `afenda-database` - Neon Postgres connection
  - `drizzle-orm` - Database ORM
  - `zod` - Input validation

## Services

### 1. Data Quality Monitor (`data-quality-monitor.ts`)

**Purpose**: Execute automated data quality checks and track metrics.

**Use Cases**:
- Daily DQ scorecard (completeness, accuracy, validity)
- Alerting when quality drops below thresholds
- SOX controls evidence (data control testing)
- Data quality dashboards for executives

**Input**:
- Organization ID
- Data domain (customers, products, transactions)
- Quality rules (required fields, format validation, range checks)
- Thresholds (warning at 90%, critical at 80%)

**Output**:
- DQ score (0-100)
- Pass/fail by dimension
- Failed record details
- Trend analysis (improving/declining)

**Example**:
```typescript
const results = await monitorDataQuality({
    orgId: 'org_123',
    dataDomain: 'CUSTOMERS',
    rules: [
        {
            dimension: 'COMPLETENESS',
            field: 'email_address',
            expected: 95.0, // 95% populated
            critical: 90.0
        },
        {
            dimension: 'VALIDITY',
            field: 'phone_number',
            pattern: '^\\+?1?\\d{10}$', // US phone format
            expected: 98.0
        },
        {
            dimension: 'UNIQUENESS',
            field: 'customer_id',
            expected: 100.0 // No duplicates
        }
    ]
});
// Returns: Overall score 94.2, email completeness at 93% (warning), 
//          phone validity 99% (pass), uniqueness 100% (pass)
```

**Business Value**:
- 30% reduction in reporting errors through early detection
- SOX compliance evidence for data controls
- Proactive data quality vs. reactive firefighting

---

### 2. Lineage Tracer (`lineage-tracer.ts`)

**Purpose**: Track data lineage from source to consumption.

**Use Cases**:
- Impact analysis before schema changes
- Root cause analysis for data discrepancies
- GDPR Article 30 compliance (data processing records)
- Audit trails for SOX/BCBS 239

**Input**:
- Data element identifier (table.column or report field)
- Lineage direction (upstream sources or downstream consumers)
- Depth (how many hops to trace)

**Output**:
- Lineage graph (nodes = tables/reports, edges = transformations)
- Transformation logic at each step
- Data owners and stewards
- Last update timestamp

**Example**:
```typescript
const lineage = await traceLineage({
    orgId: 'org_123',
    dataElement: 'reporting.sales_dashboard.total_revenue',
    direction: 'UPSTREAM',
    depth: 5
});
// Returns:
// sales_dashboard.total_revenue ←
//   fact_sales.revenue (SUM aggregation) ←
//     stg_orders.order_amount (currency conversion USD) ←
//       raw_erp.sales_orders.amount_local ←
//         ERP System (Netsuite) - Daily sync
```

**Business Value**:
- 80% faster root cause analysis for data issues
- GDPR compliance evidence
- Safe schema changes (know what will break)

---

### 3. Metadata Manager (`metadata-manager.ts`)

**Purpose**: Centralized metadata repository with business glossary.

**Use Cases**:
- Business glossary (what is "Active Customer"?)
- Technical metadata (data types, primary keys, indexes)
- Operational metadata (refresh schedules, data volumes)
- Self-service analytics (discover available datasets)

**Input**:
- Metadata type (business term, technical schema, operational stats)
- Search query or registration details
- Glossary definitions

**Output**:
- Metadata catalog
- Search results with relevance scores
- Usage statistics (most queried tables)
- Schema documentation

**Example**:
```typescript
// Register business term
await registerMetadata({
    orgId: 'org_123',
    metadataType: 'BUSINESS_TERM',
    term: 'Active Customer',
    definition: 'Customer with purchase in last 12 months',
    owner: 'VP of Sales',
    relatedTables: ['customers', 'orders'],
    synonyms: ['Recent Customer', 'Engaged Customer']
});

// Search metadata
const results = await searchMetadata({
    orgId: 'org_123',
    query: 'customer email',
    metadataTypes: ['TECHNICAL_SCHEMA']
});
// Returns: customers.email_address (VARCHAR), orders.customer_email (VARCHAR),
//          email_campaign_recipients.email (VARCHAR)
```

**Business Value**:
- 50% faster analyst onboarding (self-service data discovery)
- Reduced duplicate data assets (find before building)
- Consistent business definitions enterprise-wide

---

### 4. Master Data Steward (`master-data-steward.ts`)

**Purpose**: Golden record creation with duplicate detection and merging.

**Use Cases**:
- Customer master data deduplication
- Product catalog consolidation (post-M&A)
- Vendor master cleanup
- Employee identity resolution across HR systems

**Input**:
- Domain (customers, products, vendors, employees)
- Source systems
- Matching rules (fuzzy, probabilistic, exact)
- Merge strategy (auto-merge, steward approval, manual review)

**Output**:
- Golden record (master ID)
- Source record linkages
- Confidence scores
- Stewardship tasks (approve merges, resolve conflicts)

**Example**:
```typescript
const result = await createGoldenRecord({
    orgId: 'org_123',
    domain: 'CUSTOMERS',
    sourceRecords: [
        {
            systemId: 'CRM',
            recordId: 'cust_456',
            data: {
                name: 'John Smith',
                email: 'john.smith@acme.com',
                phone: '555-1234'
            }
        },
        {
            systemId: 'Billing',
            recordId: 'bill_789',
            data: {
                name: 'J. Smith',
                email: 'jsmith@acme.com',
                phone: '555-1234'
            }
        }
    ],
    matchingStrategy: {
        algorithm: 'PROBABILISTIC',
        thresholds: {
            autoMerge: 95,  // >= 95% match score
            manualReview: 70 // 70-95% requires steward
        }
    }
});
// Returns: Golden record with masterId 'MDM-CUST-123',
//          source mappings, match score 96% → auto-merged
```

**Business Value**:
- $500k-2M savings from duplicate vendor payments prevented
- 360° customer view for sales/support
- Post-M&A integration acceleration (6 months → 3 months)

---

### 5. Data Classifier (`data-classifier.ts`)

**Purpose**: Automatically classify data for privacy and security compliance.

**Use Cases**:
- GDPR Article 30 data inventory
- PCI DSS scope reduction (identify cardholder data)
- HIPAA PHI discovery
- Data residency compliance (EU, China data localization)

**Input**:
- Database schema or table name
- Classification types (PII, PHI, PCI, confidential)
- Detection patterns (regex, ML inference)

**Output**:
- Field-level classifications
- Risk score
- Recommended controls (encryption, masking, retention)
- Privacy impact assessment

**Example**:
```typescript
const classification = await classifyData({
    orgId: 'org_123',
    tableName: 'customers',
    classificationTypes: ['PII', 'PCI'],
    autoInfer: true
});
// Returns:
// - email: PII (GDPR Article 4)
// - ssn: PII + Restricted (GDPR Special Category)
// - credit_card_number: PCI (PCI DSS 3.2)
// - home_address: PII
// Overall risk: HIGH (contains PCI data)
// Recommendations: 
//   - Encrypt credit_card_number at rest
//   - Mask SSN in reports (XXX-XX-1234)
//   - Retention: Delete after account closure + 7 years (legal hold)
```

**Business Value**:
- GDPR compliance automation ($4.4M avg fine avoidance)
- PCI scope reduction (annual savings $50k-200k)
- Data breach liability reduction

---

### 6. Retention Manager (`retention-manager.ts`)

**Purpose**: Enforce data retention policies and deletion workflows.

**Use Cases**:
- GDPR right to erasure (30-day SLA)
- Legal hold management
- Automated data archival
- Retention schedule enforcement (7 years for tax records)

**Input**:
- Data domain
- Retention policy (duration, exceptions, legal holds)
- Deletion requests
- Disposition actions (archive, anonymize, purge)

**Output**:
- Scheduled deletion jobs
- Legal hold status
- Retention compliance report
- GDPR erasure certificates

**Example**:
```typescript
// Define retention policy
await setRetentionPolicy({
    orgId: 'org_123',
    domain: 'CUSTOMER_DATA',
    retentionRules: [
        {
            category: 'TRANSACTION_HISTORY',
            duration: '7_YEARS', // Tax compliance
            dispositionAction: 'ARCHIVE_THEN_PURGE'
        },
        {
            category: 'MARKETING_CONSENT',
            duration: '3_YEARS', // GDPR ePrivacy Directive
            dispositionAction: 'PURGE'
        }
    ],
    legalHoldExemptions: [
        { reason: 'LITIGATION', caseId: 'CASE-2024-001' }
    ]
});

// Process GDPR deletion request
await processErasureRequest({
    orgId: 'org_123',
    dataSubjectId: 'cust_456',
    requestDate: '2024-01-15',
    requestType: 'GDPR_ARTICLE_17', // Right to erasure
    scope: 'ALL_PERSONAL_DATA'
});
// Returns: Deletion scheduled for 2024-02-14 (30-day SLA),
//          certificate of erasure issued, audit trail logged
```

**Business Value**:
- GDPR compliance (avoid 4% global revenue fines)
- Reduced storage costs (10-30% via automated archival)
- Legal risk mitigation (proper evidence preservation)

---

## Database Tables

### `data_quality_rules`
- `rule_id` (PK)
- `org_id`
- `data_domain` - Customers, products, transactions, etc.
- `dimension` - Completeness, accuracy, validity, etc.
- `field_name` - Which column to check
- `rule_expression` - SQL or regex pattern
- `threshold_warning` - % or value
- `threshold_critical`
- `owner_email` - Who to alert

### `data_quality_results`
- `result_id` (PK)
- `rule_id` (FK)
- `execution_date`
- `score` - 0-100
- `status` - Pass, warning, critical
- `failed_record_count`
- `sample_failures` - JSON array of example bad records

### `data_lineage`
- `lineage_id` (PK)
- `org_id`
- `source_object` - Table/report name
- `source_field` - Column name
- `target_object`
- `target_field`
- `transformation_logic` - SQL or description
- `update_timestamp`

### `metadata_catalog`
- `metadata_id` (PK)
- `org_id`
- `metadata_type` - Business_term, technical_schema, operational
- `object_name` - Table, column, report name
- `definition` - Human-readable description
- `owner` - Data steward
- `tags` - JSON array for search
- `usage_count` - How often queried

### `golden_records`
- `master_id` (PK) - Unique golden record ID
- `org_id`
- `domain` - Customers, products, vendors
- `golden_data` - JSON of authoritative values
- `source_mappings` - JSON array of source system records
- `confidence_score` - 0-100
- `steward_approved` - Boolean

### `data_classifications`
- `classification_id` (PK)
- `org_id`
- `table_name`
- `column_name`
- `classification` - PII, PHI, PCI, confidential, public
- `risk_level` - Low, medium, high, critical
- `recommended_controls` - JSON array
- `last_classified` - Timestamp

### `retention_policies`
- `policy_id` (PK)
- `org_id`
- `data_category` - Transaction history, customer data, logs
- `retention_duration` - 3_YEARS, 7_YEARS, INDEFINITE
- `disposition_action` - Archive, anonymize, purge
- `legal_holds` - JSON array of active holds

### `erasure_requests`
- `request_id` (PK)
- `org_id`
- `data_subject_id` - Customer/employee ID
- `request_date`
- `request_type` - GDPR_Article_17, CCPA, internal
- `status` - Submitted, in_progress, completed
- `completion_date`
- `certificate_url` - Proof of deletion

## Integration Points

### Data Warehouse
- Query table/column metadata
- Execute DQ validation queries
- Generate lineage from ETL logs

### Master Data Hub
- Deduplicate customer/product records
- Synchronize golden records to downstream systems

### Privacy Portal
- Process GDPR deletion requests
- Generate data subject access reports (Article 15)

### Audit/Compliance
- Provide DQ evidence for SOX controls
- Lineage documentation for BCBS 239

## Business Impact

### Cost Savings
- **Storage costs**: 10-30% reduction via retention enforcement
- **Duplicate prevention**: $500k-2M vendor payment duplicates avoided
- **DQ firefighting**: 50% reduction in data issue resolution time

### Risk Mitigation
- **GDPR fines**: Avoid 4% global revenue penalties
- **PCI fines**: $5k-100k per month non-compliance
- **Audit deficiencies**: Reduce SOX/BCBS 239 findings by 40%

### Operational Efficiency
- **Analyst productivity**: 50% faster via self-service metadata catalog
- **M&A integration**: Accelerate by 3-6 months
- **Reporting trust**: Increase executive confidence in data accuracy

## Related Packages

- `afenda-data-warehouse` - Central analytics repository
- `afenda-mdm` - Master data management hub
- `afenda-access-governance` - Data access controls
- `afenda-audit` - DQ evidence for financial audits

## Compliance Frameworks

### GDPR (General Data Protection Regulation)
- Article 30 - Records of processing activities (lineage)
- Article 15 - Right of access (metadata queries)
- Article 17 - Right to erasure (retention manager)

### BCBS 239 (Basel Committee)
- Principle 3 - Accuracy and integrity (DQ monitoring)
- Principle 4 - Completeness (DQ validation)
- Principle 11 - Data architecture (lineage, metadata)

### SOX (Sarbanes-Oxley)
- Section 404 - Data controls effectiveness (DQ testing)

### CCPA (California Consumer Privacy Act)
- Right to delete (retention manager)
- Data inventory (classification)

## References

- [GDPR Text](https://gdpr-info.eu/) - Official regulation
- [BCBS 239](https://www.bis.org/publ/bcbs239.htm) - Risk data aggregation principles
- [DAMA DMBOK](https://www.dama.org/cpages/body-of-knowledge) - Data management body of knowledge
