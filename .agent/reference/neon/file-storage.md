# File Storage with Neon + Cloudflare R2
@doc-version: 2026-02-11
@last-updated: 2026-02-11

## Architecture

```
Client (browser)
  │
  ├─ 1. POST /api/storage/presign { fileName, contentType }
  │     → Backend generates presigned URL via @aws-sdk/s3-request-presigner
  │     ← Returns { presignedUrl, objectKey, publicFileUrl }
  │
  ├─ 2. PUT presignedUrl (upload file directly to R2)
  │     → File goes straight to R2, never touches your server
  │
  └─ 3. POST /api/storage/metadata { objectKey, publicFileUrl, ... }
        → Backend saves metadata to Neon (r2_files table)
        ← Returns { success: true, file }
```

Files upload directly from browser → R2 via presigned URLs. Server only handles URL generation and metadata storage.

## File Layout

```
apps/web/
├── src/lib/r2.ts                          ← S3Client for R2
├── app/api/storage/
│   ├── presign/route.ts                   ← Generate presigned upload URL
│   └── metadata/route.ts                  ← Save/list file metadata (POST/GET)
packages/database/
└── src/schema.ts                          ← r2_files table with RLS
```

## R2 Client (`src/lib/r2.ts`)

```typescript
import { S3Client } from '@aws-sdk/client-s3';

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? 'axis-attachments';
export const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;
```

## Database Schema (`r2_files`)

```typescript
export const r2Files = pgTable('r2_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().default(sql`(auth.user_id())`),
  objectKey: text('object_key').notNull().unique(),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name'),
  contentType: text('content_type'),
  sizeBytes: integer('size_bytes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  crudPolicy({
    role: authenticatedRole,
    read: authUid(table.userId),
    modify: authUid(table.userId),
  }),
]);
```

RLS ensures users can only see/modify their own files.

## API Routes

### POST /api/storage/presign
- Auth required
- Input: `{ fileName, contentType }`
- Returns: `{ presignedUrl, objectKey, publicFileUrl }`
- Object key format: `{userId}/{uuid}-{fileName}`

### POST /api/storage/metadata
- Auth required
- Input: `{ objectKey, publicFileUrl?, fileName?, contentType?, sizeBytes? }`
- Returns: `{ success: true, file }`

### GET /api/storage/metadata
- Auth required
- Returns: `{ files: R2File[] }` (user's files only, RLS-gated)

## Environment Variables

```
R2_ACCOUNT_ID              ← Cloudflare account ID
R2_ACCESS_KEY_ID           ← R2 API token access key
R2_SECRET_ACCESS_KEY       ← R2 API token secret
R2_BUCKET_NAME             ← Bucket name (default: axis-attachments)
R2_ENDPOINT                ← R2 endpoint URL
R2_PUBLIC_BASE_URL         ← Optional: public bucket URL for direct read links
```

## CORS Configuration (Cloudflare Dashboard)

Must be configured in R2 bucket settings for client-side uploads:

```json
[{
  "AllowedOrigins": [
    "https://www.nexuscanon.com",
    "http://localhost:3000"
  ],
  "AllowedMethods": ["PUT", "GET"]
}]
```

## Dependencies

| Package | Location | Purpose |
|---------|----------|---------|
| `@aws-sdk/client-s3` | `apps/web` | S3-compatible client for R2 |
| `@aws-sdk/s3-request-presigner` | `apps/web` | Generate presigned upload URLs |
| `afena-database` | `apps/web` | DB access + schema + operators |

## Client Upload Flow (for UI implementation)

```typescript
// 1. Get presigned URL
const res = await fetch('/api/storage/presign', {
  method: 'POST',
  body: JSON.stringify({ fileName: file.name, contentType: file.type }),
});
const { presignedUrl, objectKey, publicFileUrl } = await res.json();

// 2. Upload directly to R2
await fetch(presignedUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
});

// 3. Save metadata
await fetch('/api/storage/metadata', {
  method: 'POST',
  body: JSON.stringify({ objectKey, publicFileUrl, fileName: file.name, contentType: file.type, sizeBytes: file.size }),
});
```
