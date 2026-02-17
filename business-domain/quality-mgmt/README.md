# @afenda-quality-mgmt

Enterprise quality management, inspections, and compliance.

## Features

- **Inspections**: Quality tests, inspection plans, acceptance criteria
- **NCR Management**: Non-conformance reports, disposition, root cause
- **CAPA**: Corrective and preventive actions, effectiveness checks
- **Certifications**: Certificate of analysis, regulatory compliance
- **Quality Analytics**: Defect rates, Pareto analysis, cost of quality

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, production, receiving, drizzle-orm, zod

**Cross-Domain Dependencies**: production (work orders), receiving (incoming
inspections) - documented as exception for quality control workflows
