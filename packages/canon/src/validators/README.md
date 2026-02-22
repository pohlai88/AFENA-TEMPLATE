# Canon Validators

**Location:** `packages/canon/src/validators`  
**Purpose:** Validation rules and presets for custom field values and entity data

---

## Overview

This directory contains validation logic for custom field values and entity-specific validation rules. It provides both core validation functions and configurable presets for common validation patterns.

---

## Directory Structure

```
validators/
├── core/              # Core validation functions
├── presets/           # Pre-configured validation rules
├── rules/             # Custom validation rule definitions
├── custom-field-value.ts  # Custom field value validator
└── index.ts           # Barrel exports
```

---

## Key Files

### Core Validators

- **`custom-field-value.ts`** - Validates custom field values against field definitions
  - Type-specific validation (string, number, date, boolean, etc.)
  - Constraint enforcement (min/max, pattern, enum values)
  - Required field validation

### Validation Presets

- **`presets/`** - Pre-configured validation rules for common patterns
  - Email validation
  - Phone number validation
  - URL validation
  - Date range validation
  - Numeric range validation

### Custom Rules

- **`rules/`** - Custom validation rule definitions
  - Business-specific validation logic
  - Cross-field validation
  - Conditional validation

---

## Usage

### Custom Field Validation

```typescript
import { validateCustomFieldValue } from 'afenda-canon';

const result = validateCustomFieldValue({
  fieldDef: {
    fieldType: 'string',
    constraints: {
      maxLength: 100,
      pattern: '^[A-Za-z]+$'
    }
  },
  value: 'HelloWorld'
});

if (!result.valid) {
  console.error(result.errors);
}
```

### Using Presets

```typescript
import { emailValidator, phoneValidator } from 'afenda-canon/validators';

// Email validation
const emailResult = emailValidator.validate('user@example.com');

// Phone validation
const phoneResult = phoneValidator.validate('+60123456789');
```

---

## Validation Rules

### Type-Specific Rules

| Field Type | Constraints | Example |
|------------|-------------|---------|
| **string** | maxLength, minLength, pattern | Text fields, codes |
| **number** | min, max, precision | Amounts, quantities |
| **date** | minDate, maxDate | Effective dates |
| **boolean** | - | Flags, toggles |
| **enum** | allowedValues | Status, category |
| **json** | schema | Complex structures |

### Cross-Field Rules

- **Conditional Required** - Field required based on another field's value
- **Mutual Exclusivity** - Only one of multiple fields can have a value
- **Date Ranges** - End date must be after start date
- **Numeric Ranges** - Max must be greater than min

---

## Design Principles

1. **Type Safety** - All validators are strongly typed
2. **Composable** - Validators can be combined and reused
3. **Pure Functions** - No side effects, deterministic results
4. **Error Messages** - Clear, actionable validation errors
5. **Performance** - Efficient validation with minimal overhead

---

## Related

- [../schemas/README.md](../schemas/README.md) - Zod schemas for structural validation
- [../types/README.md](../types/README.md) - TypeScript type definitions
- [Main README](../../README.md) - Package overview
