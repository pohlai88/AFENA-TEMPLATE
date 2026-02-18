# afenda-retail-management

<!-- afenda:badges -->
![G - Franchise & Retail](https://img.shields.io/badge/G-Franchise+%26+Retail-FF8B00?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--retail--management-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-G%20·%20of%2010-lightgrey?style=flat-square)


Retail store operations and point-of-sale management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-retail-management` provides domain-specific business logic for retail
store operations including store management, POS transactions, staff scheduling,
inventory tracking, and store performance analytics.

## When to Use This Package

Use `afenda-retail-management` when you need to:

- Manage retail store operations and configuration
- Process point-of-sale transactions
- Schedule and track staff shifts
- Manage store inventory levels
- Track shrinkage and loss prevention
- Analyze store performance metrics

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Store Management

Manage multiple store formats:
- Flagship stores
- Standard stores
- Outlet stores
- Pop-up stores
- Franchise locations

### POS Transactions

Process retail sales with:
- Multi-item line detail
- Multiple payment methods (cash, card, mobile, gift card)
- Tax calculations
- Discount application
- Transaction totals

### Staff Scheduling

Optimize labor with:
- Weekly shift schedules
- Multiple roles (cashier, sales floor, stock, manager)
- Labor cost tracking
- Actual hours vs. scheduled

### Inventory Management

Track store inventory:
- On-hand quantities
- Committed quantities
- Available to sell
- Reorder points
- Stock status (in-stock, low-stock, out-of-stock)

### Shrinkage Tracking

Monitor inventory loss:
- Book vs. physical inventory
- Shrinkage reasons (theft, damage, errors)
- Shrinkage percentage
- Loss prevention metrics

### Performance Analytics

Measure store success with:
- Sales per square meter
- Conversion rate
- Average basket size
- Labor cost percentage
- Inventory turnover
- Stockout rate
- Target achievement
