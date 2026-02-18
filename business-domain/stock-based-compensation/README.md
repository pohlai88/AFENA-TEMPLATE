# Stock-Based Compensation

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--stock--based--compensation-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


Stock-based compensation management with ASC 718 / IFRS 2 compliance for equity compensation programs.

## Purpose

Manage the complete lifecycle of equity compensation grants including stock options, RSUs, PSUs, SARs, and phantom stock. Provides fair value calculation, vesting schedule management, expense recognition, and tax accounting compliance required for IPO-ready companies.

## When to Use

- **IPO-ready companies** - ASC 718 / IFRS 2 compliance for S-1 filing
- **Venture-backed startups** - Equity compensation programs for talent retention
- **Public companies** - Ongoing equity grant management and expense tracking
- **Private companies** - 409A valuation compliance and grant administration

## Key Features

### Grant Management
- Stock options (ISO, NSO)
- Restricted Stock Units (RSUs)
- Performance Stock Units (PSUs)
- Stock Appreciation Rights (SARs)
- Phantom stock

### Vesting Schedules
- Time-based vesting (cliff, graded, monthly)
- Performance-based vesting (revenue, EBITDA, milestones)
- Market-based vesting (stock price targets, TSR)
- Hybrid vesting conditions

### Fair Value Calculation
- Black-Scholes option pricing model
- Monte Carlo simulation for complex grants
- Lattice models for early exercise
- 409A valuation integration

### Expense Recognition
- ASC 718 / IFRS 2 compliance
- Graded vesting expense attribution
- Forfeiture estimation and true-up
- Modification accounting (repricing, acceleration)

### Tax Accounting
- 409A fair market value compliance
- Tax withholding on exercise/vesting
- ISO vs NSO tax treatment
- Alternative Minimum Tax (AMT) calculation

### Diluted EPS Impact
- Treasury stock method
- If-converted method for convertible securities
- Weighted average shares outstanding

## Installation

```bash
pnpm add @afenda/domain-stock-based-compensation
```

## Usage

### Create Stock Grant

```typescript
import { createStockGrant, GrantType, VestingType } from '@afenda/domain-stock-based-compensation';

const grant = await createStockGrant({
  employeeId: 'emp-123',
  grantType: GrantType.RSU,
  grantDate: new Date('2025-01-01'),
  sharesGranted: 10000,
  vestingType: VestingType.TIME_BASED,
  vestingSchedule: {
    cliffMonths: 12,
    vestingMonths: 48,
    vestingFrequency: 'monthly'
  },
  fairValuePerShare: 10.50,
  strikePrice: null, // RSUs have no strike
});
```

### Calculate Fair Value (Black-Scholes)

```typescript
import { calculateFairValue, ValuationMethod } from '@afenda/domain-stock-based-compensation';

const fairValue = await calculateFairValue({
  grantId: grant.id,
  method: ValuationMethod.BLACK_SCHOLES,
  inputs: {
    stockPrice: 12.00,
    strikePrice: 10.00,
    volatility: 0.45,
    riskFreeRate: 0.045,
    dividendYield: 0.0,
    timeToExpiration: 10, // years
  },
});
```

### Calculate Vesting Schedule

```typescript
import { calculateVestingSchedule } from '@afenda/domain-stock-based-compensation';

const tranches = await calculateVestingSchedule(grant);

// Returns vesting tranches:
// [
//   { vestDate: '2026-01-01', sharesVesting: 12000, cumulativeShares: 12000, status: 'scheduled' }, // Cliff
//   { vestDate: '2026-02-01', sharesVesting: 1000, cumulativeShares: 13000, status: 'scheduled' },   // Monthly
//   ...
// ]
```

### Evaluate Performance Conditions

```typescript
import { evaluatePerformanceConditions } from '@afenda/domain-stock-based-compensation';

const vestingPct = await evaluatePerformanceConditions(
  [
    {
      metric: 'revenue',
      target: 10000000,
      threshold: 8000000,
      maximum: 12000000,
      thresholdPct: 50,
      targetPct: 100,
      maximumPct: 150,
      measurementPeriod: '2025',
    },
  ],
  { revenue: 11000000 } // Actual performance
);

// Returns: 125 (125% vesting - between target and maximum)
```

### Forecast Vesting

```typescript
import { forecastVesting } from '@afenda/domain-stock-based-compensation';

const forecast = await forecastVesting(grant, 12); // 12 months

// Returns monthly forecast:
// [
//   { month: '2025-02', sharesVesting: 1000, cumulativeVested: 1000 },
//   { month: '2025-03', sharesVesting: 1000, cumulativeVested: 2000 },
//   ...
// ]
```

### Calculate Compensation Expense

```typescript
import { calculateCompensationExpense } from '@afenda/domain-stock-based-compensation';

const expense = await calculateCompensationExpense({
  grantId: grant.id,
  period: '2025-Q1',
  vestingMethod: 'graded', // or 'straight-line'
  forfeitureRate: 0.05, // 5% estimated forfeiture
});

// Returns quarterly expense amount for GL posting
```

### Process Grant Exercise

```typescript
import { processExercise } from '@afenda/domain-stock-based-compensation';

const exercise = await processExercise({
  grantId: grant.id,
  exerciseDate: new Date('2027-06-15'),
  sharesExercised: 5000,
  fairMarketValue: 25.00,
  cashlessExercise: true, // Sell-to-cover
  taxWithholding: {
    federalRate: 0.22,
    stateRate: 0.05,
    ficaRate: 0.0765,
  },
});

// Returns:
// {
//   sharesExercised: 5000,
//   sharesRetained: 3617, // After withholding
//   sharesSold: 1383,
//   taxWithheld: 34575,
//   netProceeds: 0 (cashless)
// }
```

## API Reference

### Grant Management

- `createStockGrant(data)` - Create new equity grant
- `updateGrant(grantId, updates)` - Update grant details
- `cancelGrant(grantId, reason)` - Cancel unvested grant
- `getGrant(grantId)` - Retrieve grant details
- `listGrants(filters)` - Query grants by employee, status, type

### Vesting

- `calculateVestingSchedule(grant)` - Generate vesting tranches from grant
- `recordVesting(grantId, vestDate)` - Record shares vested
- `accelerateVesting(grantId, shares)` - Early vesting (M&A, termination)
- `getVestingStatus(grantId, asOfDate)` - Get vesting status with next vest date
- `evaluatePerformanceConditions(conditions, metrics)` - Calculate performance vesting %
- `evaluateMarketConditions(conditions, values)` - Check market conditions met
- `forecastVesting(grant, months)` - Project future vesting for forecasting

### Fair Value

- `calculateFairValue(grant, inputs, method)` - Calculate fair value using specified method
- `calculateBlackScholes(inputs)` - Black-Scholes option pricing model
- `calculateMonteCarlo(inputs, simulations)` - Monte Carlo simulation for complex grants
- `calculateLattice(inputs, steps)` - Lattice/binomial model with early exercise
- `get409AValuation(companyId, grantDate)` - Get applicable 409A FMV for grant date
- `record409AValuation(companyId, fmv, date, firm)` - Record new 409A valuation

### Expense Recognition

- `calculateCompensationExpense(params)` - Period expense calculation
- `postExpenseToGL(grantId, period)` - Create GL journal entry
- `estimateForfeitures(cohort)` - Forfeiture rate estimation
- `recordForfeiture(grantId, shares)` - Record actual forfeiture

### Exercise & Settlement

- `processExercise(params)` - Exercise stock options
- `processVesting(grantId, shares)` - RSU/PSU settlement
- `calculateTaxWithholding(params)` - Tax withholding calculation
- `issueCertificate(exerciseId)` - Issue stock certificate

### Modifications

- `reprice Grant(grantId, newStrike)` - Repricing underwater options
- `modifyVesting(grantId, newSchedule)` - Change vesting terms
- `recordModification(params)` - ASC 718 modification accounting

### Dilution & EPS

- `calculateDilutedShares(period)` - Treasury stock method
- `getWeightedAverageShares(period)` - WASO calculation
- `getOptionPool(asOfDate)` - Available option pool shares

## Architecture

### Dependencies

- `@afenda/canon` - Type definitions for grants, exercises, valuations
- `@afenda/database` - Schema for stock compensation entities
- `@afenda/logger` - Audit trail for grant lifecycle events

### Database Schema

```typescript
stock_grants           // Grant master records
vesting_schedules      // Vesting tranches
grant_exercises        // Stock option exercises
grant_settlements      // RSU/PSU settlements
grant_modifications    // Repricing, acceleration
fair_value_valuations  // 409A valuations, Black-Scholes
compensation_expense   // Period expense accruals
tax_withholdings       // Tax withholding records
diluted_shares         // Diluted shares calculation
```

### Integration Points

- **CRUD** - Grant creation/update handlers
- **Accounting** - GL posting for compensation expense
- **Payroll** - Tax withholding on exercise/vesting
- **Cap Table Management** - Option pool allocation
- **HR Core** - Employee termination triggers

## Compliance

### Accounting Standards

- **ASC 718** - Compensation—Stock Compensation (US GAAP)
- **IFRS 2** - Share-based Payment (International)
- **Graded vesting** - Attribution of expense over requisite service period
- **Modification accounting** - Incremental value on repricing

### Tax Compliance

- **IRC Section 409A** - Fair market value requirements for deferred compensation
- **IRC Section 422** - Incentive Stock Options (ISO) tax treatment
- **IRC Section 83** - Property transferred in connection with services
- **AMT** - Alternative Minimum Tax on ISO exercise

### Diluted EPS

- **ASC 260** - Earnings Per Share (diluted shares calculation)
- **Treasury stock method** - In-the-money options included in WASO
- **If-converted method** - Convertible securities

## Testing

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Type check
pnpm type-check
```

## Examples

See `/examples` directory for:
- Startup equity program setup
- ISO vs NSO grant comparison
- Performance vesting with market conditions
- Repricing underwater options
- M&A acceleration scenarios
- Diluted EPS calculation for S-1 filing

## License

MIT

## Support

For issues or questions:
- GitHub Issues: [afenda-nexus/issues](https://github.com/afenda/afenda-nexus/issues)
- Documentation: [docs.afenda.com](https://docs.afenda.com)
