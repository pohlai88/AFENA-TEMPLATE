# @afenda-receivables

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
