# afenda-trade-marketing

<!-- afenda:badges -->
![C - Sales, Marketing & CX](https://img.shields.io/badge/C-Sales%2C+Marketing+%26+CX-FF5630?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--trade--marketing-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-C%20·%20of%2010-lightgrey?style=flat-square)


Trade marketing and channel partner management for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-trade-marketing` provides domain-specific business logic for trade
marketing operations including promotions, channel partner management, co-op
programs, and channel incentives.

## When to Use This Package

Use `afenda-trade-marketing` when you need to:

- Manage trade promotions and incentives
- Administer channel partner programs
- Run co-op advertising programs
- Process co-op reimbursement claims
- Launch channel incentive programs
- Analyze trade marketing ROI

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Trade Promotions

Support multiple promotion types:
- Volume discounts
- Rebates
- Slotting fees
- Co-op advertising
- Display allowances
- Temporary price reductions (TPR)
- Free goods

### Channel Partner Management

Organize distribution network:
- Partner types (distributor, wholesaler, retailer, dealer, agent)
- Tier system (platinum, gold, silver, bronze)
- Territory management
- Performance tracking

### Co-Op Programs

Flexible funding models:
- **Percentage match**: Brand matches partner spend by percentage
- **Dollar match**: 1:1 match up to maximum
- **Accrual**: Funding based on purchase volume
- **Fixed amount**: Set funding allocation

### Co-Op Claim Processing

Streamlined reimbursement:
- Claim submission with proof
- Reimbursement calculation by funding model
- Maximum cap enforcement
- Approval workflows
- Payment tracking

### Channel Incentives

Drive partner performance:
- SPIFF programs
- Volume bonuses
- Growth bonuses
- New product incentives
- Performance tier rewards
- Tiered payout structures

### Trade Marketing Analytics

Measure program effectiveness:
- Incremental sales
- Total investment (promotions + co-op + incentives)
- ROI calculation
- Partner growth rates
- Promotional participation
- Co-op utilization rates
