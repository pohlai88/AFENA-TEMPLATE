# afenda-consignment

<!-- afenda:badges -->
![B - Procurement & Supply Chain](https://img.shields.io/badge/B-Procurement+%26+Supply+Chain-36B37E?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--consignment-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-B%20·%20of%2010-lightgrey?style=flat-square)


Consignment inventory and commission management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-consignment` provides domain-specific business logic for consignment
sales operations including consignment agreements, inventory tracking, commission
calculations, settlement processing, and consignor performance analytics.

## When to Use This Package

Use `afenda-consignment` when you need to:

- Create and manage consignment agreements with consignors
- Track consignment inventory (received, sold, returned quantities)
- Calculate commissions with tiered, percentage, or fixed-per-unit models
- Automate settlement processing with various frequencies
- Identify slow-moving consignment items
- Analyze consignment performance metrics

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Commission Models

- **Tiered**: Commission rates based on sales volume thresholds
- **Percentage**: Fixed percentage of sales price
- **Fixed per unit**: Fixed amount per item sold

### Inventory Tracking

Track consignment inventory through its lifecycle:
- Received from consignor
- Sold to customers
- Returned to consignor
- Current on-hand quantity

### Settlement Automation

Automated settlement processing with configurable frequencies:
- Weekly, biweekly, monthly, or quarterly
- Tracks settlements by period
- Calculates amounts owed to consignors

### Performance Analytics

Monitor consignment performance with key metrics:
- Inventory turnover rate
- Sell-through percentage
- Days on hand
- Commission rates
- Return rates
