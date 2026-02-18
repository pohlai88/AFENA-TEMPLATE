# @afenda-supplier-portal

<!-- afenda:badges -->
![B - Procurement & Supply Chain](https://img.shields.io/badge/B-Procurement+%26+Supply+Chain-36B37E?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--supplier--portal-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-B%20·%20of%2010-lightgrey?style=flat-square)


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
