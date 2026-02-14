import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { withAuth } from '@/lib/api/with-auth';
import { getR2, R2_BUCKET, R2_PUBLIC_BASE_URL } from '@/lib/r2';

import type { RouteMetaStrict } from '@/lib/api/route-types';

export const ROUTE_META = {
  path: '/api/storage/presign',
  methods: ['POST'],
  tier: 'bff',
  exposeInOpenApi: false,
} as const satisfies RouteMetaStrict;

export const CAPABILITIES = ['storage.files.upload'] as const;

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const ALLOWED_CONTENT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/json',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

export const POST = withAuth(async (request, session) => {
  const body = (await request.json()) as {
    fileName?: string;
    contentType?: string;
    fileSize?: number;
  };
  const { fileName, contentType, fileSize } = body;

  if (!fileName || !contentType) {
    return { ok: false, code: 'VALIDATION_FAILED', message: 'fileName and contentType are required', status: 400 };
  }

  if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
    return { ok: false, code: 'VALIDATION_FAILED', message: 'File type not allowed', status: 400 };
  }

  if (fileSize && fileSize > MAX_FILE_SIZE) {
    return { ok: false, code: 'VALIDATION_FAILED', message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`, status: 400 };
  }

  const objectKey = `${session.userId}/${crypto.randomUUID()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: objectKey,
    ContentType: contentType,
    ContentLength: fileSize ?? undefined,
  });

  const presignedUrl = await getSignedUrl(getR2(), command, { expiresIn: 300 });

  const publicFileUrl = R2_PUBLIC_BASE_URL
    ? `${R2_PUBLIC_BASE_URL}/${objectKey}`
    : null;

  return {
    ok: true as const,
    data: { presignedUrl, objectKey, publicFileUrl },
  };
});
