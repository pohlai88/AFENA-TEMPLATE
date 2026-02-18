# Document Management Package

<!-- afenda:badges -->
![I - Analytics, Data & Integration](https://img.shields.io/badge/I-Analytics%2C+Data+%26+Integration-00C7E6?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--document--mgmt-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-I%20·%20of%2010-lightgrey?style=flat-square)


Enterprise document lifecycle management, OCR ingestion, transaction linking,
and evidence packs for audit/compliance.

## Features

- **Document Repository**: Store, version, and retrieve documents with metadata
- **OCR Ingestion**: Automated document ingestion with OCR text extraction
- **Transaction Linking**: Link documents to financial/operational transactions
- **Evidence Packs**: Automated compliance evidence collection and packaging
- **Analytics**: Document usage, storage, and retention metrics

## Dependencies

- `afenda-canon` - Core types and utilities
- `afenda-database` - Database access
- `zod` - Runtime validation

## Usage

```typescript
import {
  createEvidencePack,
  getDocumentAnalytics,
  linkToTransaction,
  processWithOCR,
  uploadDocument,
} from 'afenda-document-mgmt';
```

## Services

1. **Repository**: Document storage and retrieval
2. **OCR Ingestion**: Automated text extraction
3. **Transaction Linking**: Connect documents to business records
4. **Evidence Packs**: Compliance document packaging
5. **Analytics**: Usage and retention metrics
