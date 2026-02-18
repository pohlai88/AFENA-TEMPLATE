# @afenda-benefits

Enterprise benefits administration and enrollment management.

## Purpose

Layer 2 domain package providing employee benefits enrollment, claims
processing, COBRA administration, FSA/HSA management, and benefits analytics.

## Architecture

- **Layer:** 2 (Domain Services)
- **Dependencies:** afenda-canon (Layer 1), afenda-database (Layer 1)
- **Consumers:** HCM application layer
- **Pattern:** Pure domain functions, no logging, Zod validation

## Services

### enrollment.ts

- `enrollEmployee` - Enroll employee in benefit plans
- `processOpenEnrollment` - Process annual open enrollment period

### claims.ts

- `submitClaim` - Submit benefits claim
- `adjudicateClaim` - Process and adjudicate claim

### cobra.ts

- `initiateCOBRA` - Start COBRA coverage
- `calculateCOBRAPremium` - Calculate COBRA premium amount

### fsa.ts

- `contributeFSA` - Process FSA contribution
- `reimburseExpense` - Reimburse FSA-eligible expense

### benefits-analytics.ts

- `analyzeBenefitsUtilization` - Analyze benefits usage patterns
- `calculateBenefitsCost` - Calculate total benefits cost

## Usage

```typescript
import { enrollEmployee } from 'afenda-benefits';

const result = await enrollEmployee(db, orgId, {
  employeeId: 'emp-123',
  planIds: ['plan-medical-1', 'plan-dental-2'],
  effectiveDate: new Date('2026-01-01'),
});
```

## Business Value

- Automated benefits enrollment and administration
- COBRA compliance tracking
- FSA/HSA management with IRS compliance
- Benefits cost analytics and forecasting
- Employee self-service capabilities
