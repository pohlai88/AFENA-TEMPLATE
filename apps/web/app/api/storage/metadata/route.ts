import { NextResponse } from 'next/server';

import { db, eq, r2Files } from 'afena-database';

import { auth } from '@/lib/auth/server';
import { getLogger } from '@/lib/logger';

export const CAPABILITIES = ['storage.files.save', 'storage.files.metadata'] as const;

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      objectKey?: string;
      publicFileUrl?: string;
      fileName?: string;
      contentType?: string;
      sizeBytes?: number;
      checksum?: string;
    };
    const { objectKey, publicFileUrl, fileName, contentType, sizeBytes, checksum } = body;

    if (!objectKey) {
      return NextResponse.json(
        { error: 'objectKey is required' },
        { status: 400 },
      );
    }

    const [file] = await db
      .insert(r2Files)
      .values({
        objectKey,
        fileUrl: publicFileUrl ?? objectKey,
        userId: session.user.id,
        fileName: fileName ?? null,
        contentType: contentType ?? null,
        sizeBytes: sizeBytes ?? null,
        checksum: checksum ?? null,
      })
      .onConflictDoNothing({ target: r2Files.objectKey })
      .returning();

    // Idempotency: if ON CONFLICT hit, return existing row
    if (!file) {
      const [existing] = await db
        .select()
        .from(r2Files)
        .where(eq(r2Files.objectKey, objectKey));

      return NextResponse.json({ success: true, file: existing });
    }

    return NextResponse.json({ success: true, file });
  } catch (error) {
    getLogger().error({ err: error, op: 'storage.metadata.save' }, 'Metadata save error');
    return NextResponse.json(
      { error: 'Failed to save file metadata' },
      { status: 500 },
    );
  }
}

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const files = await db
      .select()
      .from(r2Files)
      .where(eq(r2Files.userId, session.user.id));

    return NextResponse.json({ files });
  } catch (error) {
    getLogger().error({ err: error, op: 'storage.metadata.fetch' }, 'Metadata fetch error');
    return NextResponse.json(
      { error: 'Failed to fetch file metadata' },
      { status: 500 },
    );
  }
}
