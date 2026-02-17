# @afenda-supplier-portal

Enterprise supplier collaboration and self-service portal.

## Features

- **Self-Service**: PO acknowledgment, ASN submission, invoice upload
- **Collaboration**: RFQ responses, engineering changes, quality alerts
- **Performance Scorecards**: OTD, quality, cost, service ratings
- **Communications**: Messaging, notifications, document sharing
- **Portal Analytics**: Usage metrics, response times, engagement

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, purchasing, drizzle-orm, zod

**Cross-Domain Dependencies**: purchasing (PO data) - documented as exception
for supplier collaboration
