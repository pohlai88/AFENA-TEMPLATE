/**
 * Document Management Package
 * Enterprise document lifecycle management and evidence packs
 */

// Repository
export type {
  Document,
  DocumentContent,
  DeleteDocumentResult,
  SearchResult,
} from './services/repository.js';
export {
  uploadDocument,
  getDocument,
  updateDocumentMetadata,
  deleteDocument,
  searchDocuments,
} from './services/repository.js';

// OCR Ingestion
export type {
  OCRResult,
  IngestedDocument,
  KeyValuePairs,
  OCRStatus,
} from './services/ocr-ingestion.js';
export {
  processWithOCR,
  ingestDocument,
  extractKeyValuePairs,
  getOCRStatus,
} from './services/ocr-ingestion.js';

// Transaction Linking
export type {
  DocumentLink,
  TransactionDocuments,
  UnlinkResult,
  DocumentLinks,
} from './services/transaction-linking.js';
export {
  linkToTransaction,
  getTransactionDocuments,
  unlinkFromTransaction,
  getDocumentLinks,
} from './services/transaction-linking.js';

// Evidence Packs
export type {
  EvidencePack,
  EvidencePackUpdate,
  FinalizedPack,
  EvidencePackDetails,
} from './services/evidence-packs.js';
export {
  createEvidencePack,
  addToEvidencePack,
  finalizeEvidencePack,
  getEvidencePack,
} from './services/evidence-packs.js';

// Document Analytics
export type {
  StorageMetrics,
  UsageMetrics,
  RetentionMetrics,
  DocumentDashboard,
} from './services/document-analytics.js';
export {
  getStorageMetrics,
  getUsageMetrics,
  getRetentionMetrics,
  getDocumentDashboard,
} from './services/document-analytics.js';
