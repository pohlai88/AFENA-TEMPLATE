# E-Invoicing CTC (afenda-e-invoicing-ctc)

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--e--invoicing--ctc-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


**Electronic invoicing with Continuous Transaction Controls (CTC) for real-time tax authority clearance in LATAM, EU, and Asia.**

---

## Purpose

This package implements **Continuous Transaction Controls (CTC)** for electronic invoicing, where tax authorities require **real-time invoice clearance** before invoices are legally valid.

CTC jurisdictions require:
1. **Pre-clearance**: Invoice submitted to tax authority **before** sending to customer
2. **Digital signature**: Cryptographic signature by tax authority or certified provider
3. **QR code**: Machine-readable validation code on invoice
4. **XML format**: Structured data (UBL, CFDI, NF-e, FatturaPA)
5. **Rejection handling**: Invalid invoice cannot be used (must cancel and reissue)

Critical for operating legally in:
- **LATAM**: Mexico (CFDI 4.0), Brazil (NF-e, NFS-e), Chile (DTE), Colombia (FE), Peru, Argentina
- **EU**: Italy (FatturaPA), France (Chorus Pro), Poland (KSeF), Spain (TicketBAI)
- **Asia**: India (e-Invoice), Indonesia (e-Faktur), Vietnam, Thailand, Malaysia, Singapore (PEPPOL)

---

## When to Use

- **Market entry requirement**: Cannot legally sell in Mexico/Brazil/Italy without CTC compliance
- **B2G transactions**: Government procurement requires e-invoicing (Italy, France, India)
- **VAT compliance**: EU B2B e-invoicing mandate (2028+)
- **Supply chain integration**: Walmart Mexico, Petrobras Brazil require e-invoices from suppliers

---

## Key Concepts

### Continuous Transaction Controls (CTC)

Tax authority **validates and authorizes** every invoice in real-time. Flow:
1. **Generate**: ERP creates invoice XML
2. **Submit**: Send to tax authority API (SAT, SEFAZ, SII, DIAN, SDI)
3. **Validate**: Tax authority checks schema, tax calculations, fiscal data
4. **Sign**: Tax authority returns digital signature + UUID/folio
5. **Stamp**: Add signature/QR to invoice PDF
6. **Send**: Deliver signed invoice to customer (now legally valid)

### Country-Specific Formats

| Country | Format | Authority | Key Features |
|---------|--------|-----------|--------------|
| **Mexico** | CFDI 4.0 | SAT | UUID, PAC certification, complemento de pago |
| **Brazil** | NF-e / NFS-e | SEFAZ | XML signature, danfe barcode, municipal/state split |
| **Italy** | FatturaPA | SDI | B2G mandatory, UBL format, SdI routing |
| **Chile** | DTE | SII | Folio authorization, CAF certificates |
| **Colombia** | FE | DIAN | CUFE UUID, habilitación |
| **India** | e-Invoice | NIC | IRN number, GST integration|
| **Poland** | KSeF | MF | 2026 mandate, B2B/B2C |

### PEPPOL Network

**Pan-European Public Procurement Online** - standardized e-invoicing network:
- Access points (service providers)
- UBL 2.1 format
- 4-corner model (sender → AP → AP → receiver)
- Mandatory for EU government procurement

---

## Services

### `invoice-generator.ts`

Generates country-specific e-invoice XML from ERP invoice data:

**Example**:
```typescript
const xml = await generateEInvoice({
    orgId: 'org_123',
    invoiceId: 'INV-2026-001',
    country: 'MX',
    format: 'CFDI_4_0'
});
// → CFDI 4.0 XML with comprobante, emisor, receptor, conceptos
```

### `clearance-client.ts`

Submits invoices to tax authority APIs for clearance:

**Example**:
```typescript
const clearance = await submitForClearance({
    orgId: 'org_123',
    country: 'MX',
    invoiceXML: xmlString,
    certificateId: 'cert_pac_123'
});
// → { status: 'approved', uuid: '12345678-1234-...', signature: '...', qrCode: '...' }
```

### `signature-validator.ts`

Validates digital signatures on received e-invoices:

**Example**:
```typescript
const isValid = await validateSignature({
    country: 'BR',
    invoiceXML: receivedXML,
    publicKey: '...'
});
// → { valid: true, signer: 'SEFAZ-SP', timestamp: '...' }
```

### `cancellation-handler.ts`

Handles invoice cancellations (with tax authority notification):

**Example**:
```typescript
const cancellation = await cancelEInvoice({
    orgId: 'org_123',
    country: 'MX',
    invoiceUUID: '12345678-...',
    reason: 'Error in amount',
    replacementInvoiceId: 'INV-2026-002'
});
// → { status: 'cancelled', cancellationUUID: '...' }
```

### `peppol-connector.ts`

Sends/receives invoices via PEPPOL network:

**Example**:
```typescript
const peppolSend = await sendViaPEPPOL({
    orgId: 'org_123',
    invoiceUBL: ublXML,
    recipientId: '9999:IT12345678901', // PEPPOL participant ID
    accessPointUrl: 'https://ap.provider.com'
});
// → { messageId: '...', status: 'delivered', timestamp: '...' }
```

### `compliance-validator.ts`

Validates invoices against country-specific business rules:

**Example**:
```typescript
const validation = await validateCompliance({
    country: 'MX',
    format: 'CFDI_4_0',
    invoiceData: {
        rfc: 'ABC123456XYZ',
        usoCFDI: 'G03',
        metodoPago: 'PUE',
        formaPago: '01'
    }
});
// → { valid: true, errors: [], warnings: ['RFC not in SAT catalog'] }
```

---

## Architecture

### Layer
**Layer 2: Domain Service**

### Dependencies
- `afenda-canon` - Standard types
- `afenda-database` - E-invoice tracking, certificates
- `afenda-logger` - Audit logging (regulatory requirement)
- `drizzle-orm` - Database queries
- `zod` - Schema validation

### Integration
- **Accounting**: Generate e-invoices from sales invoices
- **Tax compliance**: Extract VAT/GST data for tax reporting
- **Document management**: Store signed XML + PDF

### Compliance Mappings
- **Mexico SAT**: CFDI 4.0 specification
- **Brazil SEFAZ**: NF-e 4.0, NFS-e 2.0
- **Italy SDI**: FatturaPA 1.2.1
- **Chile SII**: DTE schema
- **PEPPOL**: UBL 2.1 BIS Billing 3.0
- **India NIC**: e-Invoice schema 1.1

---

## Why This Wins Deals

### Market Entry Blocker
**"Can we sell in Mexico / Brazil / Italy?"**

Without CTC compliance, you **cannot legally conduct business**:
- Mexico: SAT requires CFDI for all B2B invoices (>$2,000 MXN)
- Brazil: NF-e mandatory for product sales, NFS-e for services
- Italy: FatturaPA mandatory for B2G (government), expanding to B2B

**Deal killer** for multinational expansion. Competitors (SAP, Oracle) have full country packs.

### Supply Chain Mandate
Large buyers (Walmart, automotive OEMs) require suppliers to send e-invoices:
- Walmart Mexico: CFDI mandatory for all suppliers
- Petrobras Brazil: NF-e with specific requirements
- Italian government: FatturaPA for procurement

### Competitive Differentiation
Mid-market ERPs (QuickBooks, Xero, Zoho) have **poor or no CTC support**:
- Manual XML generation (error-prone)
- No real-time clearance integration
- No rejection handling
- No certificate management

Enterprise ERPs (SAP, Oracle) charge **$50k-$200k per country pack** for e-invoicing. AFENDA provides out-of-the-box.

---

## Usage Example

```typescript
import {
    generateEInvoice,
    submitForClearance,
    validateSignature,
    sendViaPEPPOL
} from 'afenda-e-invoicing-ctc';

// Mexico CFDI 4.0 example
const invoiceXML = await generateEInvoice({
    orgId: 'org_mx_subsidiary',
    invoiceId: 'INV-MX-001',
    country: 'MX',
    format: 'CFDI_4_0',
    emisor: {
        rfc: 'ABC123456XYZ',
        nombre: 'ACME Mexico SA de CV',
        regimenFiscal: '601'
    },
    receptor: {
        rfc: 'DEF987654ABC',
        nombre: 'Cliente SA',
        usoCFDI: 'G03'
    },
    conceptos: [
        {
            descripcion: 'Software License',
            cantidad: 1,
            valorUnitario: 10000,
            importe: 10000,
            impuestos: {
                traslados: [{ impuesto: '002', tipoFactor: 'Tasa', tasaOCuota: '0.16', importe: 1600 }]
            }
        }
    ]
});

// Submit to SAT via PAC
const clearance = await submitForClearance({
    orgId: 'org_mx_subsidiary',
    country: 'MX',
    invoiceXML,
    certificateId: 'cert_pac_finkok'
});

if (clearance.status === 'approved') {
    console.log(`CFDI UUID: ${clearance.uuid}`);
    console.log(`QR Code: ${clearance.qrCode}`);
    // Stamp PDF with UUID and QR, send to customer
}

// Italy FatturaPA example  
const fatturaXML = await generateEInvoice({
    orgId: 'org_it_subsidiary',
    invoiceId: 'INV-IT-001',
    country: 'IT',
    format: 'FatturaPA',
    cedentePrestatore: {
        idPaese: 'IT',
        idCodice: '12345678901',
        denominazione: 'ACME Italia SRL'
    },
    cessionarioCommittente: {
        codiceDestinatario: 'XXXXXXX', // SDI routing code
        denominazione: 'Ministero della Difesa'
    }
});

// Submit to SDI
const sdiResult = await submitForClearance({
    orgId: 'org_it_subsidiary',
    country: 'IT',
    invoiceXML: fatturaXML
});

// PEPPOL example (EU B2B)
const peppolUBL = await generateEInvoice({
    orgId: 'org_eu',
    invoiceId: 'INV-EU-001',
    country: 'EU',
    format: 'PEPPOL_BIS_3'
});

await sendViaPEPPOL({
    orgId: 'org_eu',
    invoiceUBL: peppolUBL,
    recipientId: '9999:NL123456789B01'
});
```

---

## Country Coverage Roadmap

### Phase 1 (Critical) ✅
- Mexico (CFDI 4.0)
- Brazil (NF-e, NFS-e)
- Italy (FatturaPA)
- PEPPOL (EU)

### Phase 2
- Chile (DTE)
- Colombia (FE)
- India (e-Invoice)
- Poland (KSeF)

### Phase 3
- Peru, Argentina, Ecuador
- Spain (TicketBAI), France (Chorus Pro)
- Indonesia, Vietnam, Thailand, Malaysia

---

## References

- [Mexico SAT CFDI 4.0](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/Anexo_20_Guia_de_llenado_CFDI.pdf)
- [Brazil NF-e Portal](http://www.nfe.fazenda.gov.br/)
- [Italy FatturaPA](https://www.fatturapa.gov.it/)
- [PEPPOL Network](https://peppol.org/)
- [Chile SII DTE](https://www.sii.cl/servicios_online/dte.html)
- [India e-Invoice](https://einvoice1.gst.gov.in/)
