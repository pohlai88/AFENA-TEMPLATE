# Access Governance Package

<!-- afenda:badges -->
![H - Governance, Risk & Compliance](https://img.shields.io/badge/H-Governance%2C+Risk+%26+Compliance-403294?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--access--governance-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-H%20·%20of%2010-lightgrey?style=flat-square)


Enterprise access governance, role-based access control (RBAC), segregation of
duties (SoD), and access certification.

## Features

- **Role Management**: Define, assign, and maintain user roles with hierarchies
- **Access Requests**: Self-service access request workflows with approval
  chains
- **SoD Rules**: Automated segregation of duties conflict detection and
  prevention
- **Access Reviews**: Periodic access certification and attestation campaigns
- **Analytics**: Access risk scoring, compliance metrics, and audit reporting

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
  createAccessReview,
  createRole,
  evaluateSoDRules,
  getGovernanceMetrics,
  requestAccess,
} from 'afenda-access-governance';
```

## Services

1. **Role Management**: RBAC role and permission management
2. **Access Requests**: Workflow-driven access provisioning
3. **SoD Rules**: Segregation of duties enforcement
4. **Access Reviews**: User access certification campaigns
5. **Analytics**: Governance dashboards and risk metrics
