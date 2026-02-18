# @afenda-shipping

<!-- afenda:badges -->
![B - Procurement & Supply Chain](https://img.shields.io/badge/B-Procurement+%26+Supply+Chain-36B37E?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--shipping-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-B%20·%20of%2010-lightgrey?style=flat-square)


Enterprise multi-carrier shipping management with rate shopping and tracking.

## Features

- **Carrier Management**: Configure carriers, rate shopping, service selection
- **Label Generation**: Generate labels for UPS/FedEx/DHL/USPS, batch printing
- **Shipment Tracking**: Track shipments, delivery notifications, exception
  handling
- **Freight Management**: LTL/FTL quoting, BOL generation, freight auditing
- **Shipping Analytics**: On-time delivery, carrier performance, cost analysis

## Architecture

**Layer**: 2 (Domain Services)\
**Dependencies**: canon, database, sales, drizzle-orm, zod
