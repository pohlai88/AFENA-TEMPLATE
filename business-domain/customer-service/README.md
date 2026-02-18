# Customer Service Package

<!-- afenda:badges -->
![C - Sales, Marketing & CX](https://img.shields.io/badge/C-Sales%2C+Marketing+%26+CX-FF5630?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--customer--service-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-C%20·%20of%2010-lightgrey?style=flat-square)


Customer service and case management with SLA tracking, escalations, knowledge
base, and service analytics.

## Features

- **Case Management**: Create, assign, and track customer service cases
- **SLA Tracking**: Define SLAs and track compliance metrics
- **Escalations**: Automated case escalation based on rules
- **Knowledge Base**: Self-service articles linked to cases
- **Service Analytics**: Case metrics, resolution time, and CSAT scores

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
  createArticle,
  createCase,
  defineSLA,
  escalateCase,
  getCaseMetrics,
} from 'afenda-customer-service';
```

## Services

1. **Case Management**: Customer service case creation and tracking
2. **SLA Tracking**: Service level agreement definition and monitoring
3. **Escalations**: Case escalation rules and processing
4. **Knowledge Base**: Knowledge article management and search
5. **Service Analytics**: Customer service performance metrics and dashboards
