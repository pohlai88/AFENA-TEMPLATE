# @afenda-receivables

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--receivables-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


Enterprise accounts receivable and collections management.

## Features

- **Invoice Processing**: Generate customer invoices, recurring billing,
  adjustments
- **Payment Application**: Cash application, auto-matching, unapplied cash
- **Collections**: Dunning workflows, collection letters, aging analysis
- **Credit Management**: Credit limits, credit holds, risk scoring
- **AR Analytics**: DSO, aging reports, cash forecast

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, workflow, sales, crm, drizzle-orm, zod
