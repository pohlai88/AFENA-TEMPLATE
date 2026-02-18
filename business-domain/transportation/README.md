# @afenda-transportation

<!-- afenda:badges -->
![B - Procurement & Supply Chain](https://img.shields.io/badge/B-Procurement+%26+Supply+Chain-36B37E?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--transportation-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-B%20·%20of%2010-lightgrey?style=flat-square)


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
