import { meterStorageBytes } from 'afena-crud';
import { db, eq, r2Files, sql } from 'afena-database';

import { withAuth } from '@/lib/api/with-auth';

import type { RouteMetaStrict } from '@/lib/api/route-types';

export const ROUTE_META = {
  path: '/api/storage/metadata',
  methods: ['GET', 'POST'],
  tier: 'bff',
  exposeInOpenApi: false,
} as const satisfies RouteMetaStrict;

export const CAPABILITIES = ['storage.files.save', 'storage.files.metadata'] as const;

export const POST = withAuth(async (request) => {
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
    return { ok: false, code: 'VALIDATION_FAILED', message: 'objectKey is required', status: 400 };
  }

  const [file] = await db
    .insert(r2Files)
    .values({
      objectKey,
      fileUrl: publicFileUrl ?? objectKey,
      fileName: fileName ?? 'untitled',
      contentType: contentType ?? 'application/octet-stream',
      sizeBytes: sizeBytes ?? 0,
      ...(checksum ? { checksum } : {}),
    })
    .onConflictDoNothing({ target: r2Files.objectKey })
    .returning();

  // Idempotency: if ON CONFLICT hit, return existing row
  if (!file) {
    const [existing] = await db
      .select()
      .from(r2Files)
      .where(eq(r2Files.objectKey, objectKey));

    return { ok: true as const, data: { file: existing } };
  }

  // Meter storage bytes at truth point (fire-and-forget)
  if (sizeBytes && sizeBytes > 0) {
    db.execute(sql`SELECT auth.org_id() AS org_id`)
      .then((res) => {
        const rows = (res as Record<string, unknown>).rows as { org_id: string | null }[];
        const orgId = rows?.[0]?.org_id;
        if (orgId) meterStorageBytes(orgId, sizeBytes);
      })
      .catch(() => { /* metering must never fail the primary operation */ });
  }

  return { ok: true as const, data: { file } };
});

export const GET = withAuth(async (_request) => {
  const dbResult = await db.execute(sql`SELECT auth.user_id() AS user_id`);
  const rows = (dbResult as Record<string, unknown>).rows as { user_id: string | null }[];
  const userId = rows?.[0]?.user_id;

  if (!userId) {
    return { ok: false, code: 'POLICY_DENIED', message: 'No user context', status: 401 };
  }

  const files = await db
    .select()
    .from(r2Files)
    .where(eq(r2Files.uploadedBy, userId));

  return { ok: true as const, data: { files } };
});
