# @afenda-transportation

Enterprise transportation management system (TMS).

## Features

- **Load Planning**: Consolidation, mode selection, load optimization
- **Route Optimization**: Shortest path, fuel efficiency, multi-stop routing
- **Carrier Selection**: Rate shopping, carrier tendering, contract management
- **Freight Audit**: Bill verification, cost reconciliation, claims
- **TMS Analytics**: Cost per mile, on-time percentage, carrier performance

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, shipping, drizzle-orm, zod

**Cross-Domain Dependencies**: shipping (shipment data) - documented as
exception for logistics workflows
