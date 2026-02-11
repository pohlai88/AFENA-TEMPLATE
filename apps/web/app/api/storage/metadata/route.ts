import { NextResponse } from 'next/server';

import { db, eq, r2Files } from 'afena-database';

import { auth } from '@/lib/auth/server';

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { objectKey, publicFileUrl, fileName, contentType, sizeBytes } =
      await request.json();

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
      })
      .returning();

    return NextResponse.json({ success: true, file });
  } catch (error) {
    console.error('Metadata save error:', error);
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
    console.error('Metadata fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file metadata' },
      { status: 500 },
    );
  }
}
