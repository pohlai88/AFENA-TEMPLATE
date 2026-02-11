import { NextRequest, NextResponse } from 'next/server';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { auth } from '@/lib/auth/server';
import { getLogger } from '@/lib/logger';
import { getR2, R2_BUCKET, R2_PUBLIC_BASE_URL } from '@/lib/r2';

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

export async function POST(request: NextRequest) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      fileName?: string;
      contentType?: string;
      fileSize?: number;
    };
    const { fileName, contentType, fileSize } = body;

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: 'fileName and contentType are required' },
        { status: 400 },
      );
    }

    if (!ALLOWED_CONTENT_TYPES.has(contentType)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 },
      );
    }

    if (fileSize && fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
        { status: 400 },
      );
    }

    const objectKey = `${session.user.id}/${crypto.randomUUID()}-${fileName}`;

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

    return NextResponse.json({
      presignedUrl,
      objectKey,
      publicFileUrl,
    });
  } catch (error) {
    getLogger().error({ err: error, op: 'storage.presign' }, 'Presign error');
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 },
    );
  }
}
