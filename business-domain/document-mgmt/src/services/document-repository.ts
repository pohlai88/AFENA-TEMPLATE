import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Document {
  id: string;
  orgId: string;
  documentNumber: string;
  title: string;
  description?: string;
  category: string;
  documentType: 'CONTRACT' | 'INVOICE' | 'RECEIPT' | 'REPORT' | 'POLICY' | 'OTHER';
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  version: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
  createdBy: string;
  createdAt: Date;
  tags?: string[];
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  changes: string;
  createdBy: string;
  createdAt: Date;
}

export async function uploadDocument(
  db: NeonHttpDatabase,
  data: Omit<Document, 'id' | 'documentNumber' | 'version' | 'status' | 'createdAt'>,
): Promise<Document> {
  // TODO: Generate document number, upload file, and insert with DRAFT status
  throw new Error('Database integration pending');
}

export async function createVersion(
  db: NeonHttpDatabase,
  documentId: string,
  fileUrl: string,
  changes: string,
  createdBy: string,
): Promise<DocumentVersion> {
  // TODO: Create new version and increment document version
  throw new Error('Database integration pending');
}

export async function searchDocuments(
  db: NeonHttpDatabase,
  orgId: string,
  query: {
    keyword?: string;
    category?: string;
    tags?: string[];
    dateFrom?: Date;
    dateTo?: Date;
  },
): Promise<Document[]> {
  // TODO: Full-text search across documents
  throw new Error('Database integration pending');
}

export async function archiveDocument(
  db: NeonHttpDatabase,
  documentId: string,
): Promise<Document> {
  // TODO: Update status to ARCHIVED
  throw new Error('Database integration pending');
}

export function generateDocumentNumber(
  orgId: string,
  category: string,
  sequence: number,
): string {
  const year = new Date().getFullYear();
  const categoryCode = category.substring(0, 3).toUpperCase();
  return `DOC-${orgId}-${categoryCode}-${year}-${String(sequence).padStart(6, '0')}`;
}

export function categorizeBySize(
  documents: Document[],
): { small: number; medium: number; large: number; total: number } {
  const MB = 1024 * 1024;
  let small = 0;
  let medium = 0;
  let large = 0;

  for (const doc of documents) {
    if (doc.fileSize < 1 * MB) small++;
    else if (doc.fileSize < 10 * MB) medium++;
    else large++;
  }

  return { small, medium, large, total: documents.length };
}

export function extractMetadata(
  mimeType: string,
  fileName: string,
): { extension: string; category: string } {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  let category = 'OTHER';
  if (mimeType.startsWith('image/')) category = 'IMAGE';
  else if (mimeType.includes('pdf')) category = 'PDF';
  else if (mimeType.includes('word')) category = 'DOCUMENT';
  else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) category = 'SPREADSHEET';

  return { extension, category };
}
