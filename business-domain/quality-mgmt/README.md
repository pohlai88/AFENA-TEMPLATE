# @afenda-quality-mgmt

<!-- afenda:badges -->
![D - Manufacturing & Quality](https://img.shields.io/badge/D-Manufacturing+%26+Quality-6554C0?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--quality--mgmt-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-D%20·%20of%2010-lightgrey?style=flat-square)


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
