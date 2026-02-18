# afenda-export

Export operations and international trade compliance for the AFENDA-NEXUS ERP system.

## Purpose

`afenda-export` provides domain-specific business logic for export operations
including documentation management, shipping coordination, HS code validation,
export restrictions screening, and landed cost calculations.

## When to Use This Package

Use `afenda-export` when you need to:

- Manage export documentation (commercial invoice, bill of lading, certificates)
- Validate HS codes for export compliance
- Check export restrictions (sanctioned countries, controlled items)
- Calculate landed costs for international shipments
- Support multiple Incoterms (EXW, FOB, CIF, DDP, etc.)
- Track export performance metrics

**Do NOT use directly** - Import through `afenda-crud` which provides
authorization and audit logging.

## Key Concepts

### Export Documentation

Manage comprehensive export documentation:
- Commercial invoice
- Packing list
- Bill of lading
- Certificate of origin
- Export licenses
- Insurance certificates
- Inspection certificates

### HS Code Validation

- Validate 6-10 digit HS codes
- Chapter validation (01-99)
- Product classification

### Export Restrictions

Screen exports for compliance:
- Sanctioned countries
- Dual-use goods (chapters 84-85)
- Controlled chemicals (chapters 28-29)
- Weapons (chapter 93)

### Landed Cost Calculation

Calculate total import costs:
- FOB price
- Freight costs
- Insurance
- Import duties
- VAT/taxes
- Total landed cost

### Incoterms Support

Support for 12 Incoterms including:
- EXW, FCA, FOB, CFR, CIF
- DAP, DDP, and others
