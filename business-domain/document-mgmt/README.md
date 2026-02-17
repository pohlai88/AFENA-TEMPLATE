# Document Management Package

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
} from "afenda-document-mgmt";
```

## Services

1. **Repository**: Document storage and retrieval
2. **OCR Ingestion**: Automated text extraction
3. **Transaction Linking**: Connect documents to business records
4. **Evidence Packs**: Compliance document packaging
5. **Analytics**: Usage and retention metrics
