import { S3Client } from '@aws-sdk/client-s3';

let _r2: S3Client | null = null;

export function getR2(): S3Client {
  if (!_r2) {
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId) throw new Error('R2_ACCOUNT_ID is not set');
    if (!accessKeyId) throw new Error('R2_ACCESS_KEY_ID is not set');
    if (!secretAccessKey) throw new Error('R2_SECRET_ACCESS_KEY is not set');

    _r2 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return _r2;
}

export const R2_BUCKET = process.env.R2_BUCKET_NAME ?? 'axis-attachments';
export const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;
