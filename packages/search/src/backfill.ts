import { dbSearchWorker, sql } from 'afena-database';

/** Chunk size for backfill (avoids timeouts). */
const BACKFILL_CHUNK_LIMIT = 10_000;

/**
 * Check if search_documents is empty (self-healing trigger).
 * Use with worker role / BYPASSRLS to see all orgs.
 */
export async function isSearchDocumentsEmpty(): Promise<boolean> {
  const result = await dbSearchWorker.execute(sql`SELECT 1 FROM search_documents LIMIT 1`);
  const rows = (result as unknown as { rows?: unknown[] }).rows;
  return !rows || rows.length === 0;
}

/**
 * Check if chunked backfill is complete (both entity types done).
 * Returns false if search_backfill_state table doesn't exist (migration not run).
 */
export async function isBackfillComplete(): Promise<boolean> {
  try {
    const result = await dbSearchWorker.execute(sql`
      SELECT 1 FROM search_backfill_state
      WHERE entity_type IN ('contacts', 'companies') AND completed = false
      LIMIT 1
    `);
    const rows = (result as unknown as { rows?: unknown[] }).rows;
    return !rows || rows.length === 0;
  } catch {
    return false;
  }
}

/**
 * Run one chunk of backfill for the next incomplete entity type.
 * Returns { entityType, count, done, allDone }.
 * Use SEARCH_WORKER_DATABASE_URL (BYPASSRLS).
 */
export async function backfillSearchDocumentsChunk(
  limit = BACKFILL_CHUNK_LIMIT,
): Promise<{ entityType: string; count: number; done: boolean; allDone: boolean }> {
  // Determine next entity type to process
  const stateResult = await dbSearchWorker.execute(sql`
    SELECT entity_type, cursor_org_id, cursor_id, completed
    FROM search_backfill_state
    WHERE entity_type IN ('contacts', 'companies')
    ORDER BY CASE entity_type WHEN 'contacts' THEN 1 WHEN 'companies' THEN 2 END
  `);
  const stateRows = (stateResult as unknown as { rows?: { entity_type: string; cursor_org_id: string | null; cursor_id: string | null; completed: boolean }[] }).rows ?? [];

  const contactsState = stateRows.find((r) => r.entity_type === 'contacts');
  const companiesState = stateRows.find((r) => r.entity_type === 'companies');

  let entityType: 'contacts' | 'companies';
  let cursorOrgId: string | null;
  let cursorId: string | null;

  if (!contactsState?.completed) {
    entityType = 'contacts';
    cursorOrgId = contactsState?.cursor_org_id ?? null;
    cursorId = contactsState?.cursor_id ?? null;
  } else if (!companiesState?.completed) {
    entityType = 'companies';
    cursorOrgId = companiesState?.cursor_org_id ?? null;
    cursorId = companiesState?.cursor_id ?? null;
  } else {
    return { entityType: 'none', count: 0, done: true, allDone: true };
  }

  const co = cursorOrgId ?? '';
  const ci = cursorId ?? '00000000-0000-0000-0000-000000000000';

  if (entityType === 'contacts') {
    const insertResult = await dbSearchWorker.execute(sql`
      WITH batch AS (
        SELECT c.org_id, c.id, c.name, c.email, c.company, c.phone, c.updated_at, c.is_deleted
        FROM contacts c
        WHERE (c.org_id, c.id) > (${co}, ${ci}::uuid)
        ORDER BY c.org_id, c.id
        LIMIT ${limit}
      ),
      inserted AS (
        INSERT INTO search_documents (org_id, entity_type, entity_id, title, subtitle, search_vector, updated_at, is_deleted)
        SELECT
          b.org_id,
          'contacts'::text,
          b.id::text,
          b.name,
          COALESCE(b.email, '') || ' ' || COALESCE(b.company, ''),
          to_tsvector('simple',
            COALESCE(b.name, '') || ' ' ||
            COALESCE(b.email, '') || ' ' ||
            COALESCE(b.company, '') || ' ' ||
            COALESCE(b.phone, '')
          ),
          b.updated_at,
          b.is_deleted
        FROM batch b
        ON CONFLICT (org_id, entity_type, entity_id)
        DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          search_vector = EXCLUDED.search_vector,
          updated_at = EXCLUDED.updated_at,
          is_deleted = EXCLUDED.is_deleted
      )
      SELECT (SELECT count(*) FROM batch) AS cnt,
             (SELECT org_id FROM batch ORDER BY org_id, id DESC LIMIT 1) AS last_org,
             (SELECT id FROM batch ORDER BY org_id, id DESC LIMIT 1) AS last_id
    `);
    const rows = (insertResult as unknown as { rows?: { cnt: number; last_org: string | null; last_id: string | null }[] }).rows ?? [];
    const row = rows[0];
    const count = row?.cnt ?? 0;
    const done = count < limit;
    const lastOrg = row?.last_org ?? null;
    const lastId = row?.last_id ?? null;

    await dbSearchWorker.execute(sql`
      INSERT INTO search_backfill_state (entity_type, cursor_org_id, cursor_id, rows_processed, completed, updated_at)
      VALUES ('contacts', ${lastOrg}, ${lastId}, ${count}, ${done}, now())
      ON CONFLICT (entity_type)
      DO UPDATE SET
        cursor_org_id = EXCLUDED.cursor_org_id,
        cursor_id = EXCLUDED.cursor_id,
        rows_processed = search_backfill_state.rows_processed + EXCLUDED.rows_processed,
        completed = EXCLUDED.completed,
        updated_at = now()
    `);

    return { entityType: 'contacts', count, done, allDone: done && (companiesState?.completed ?? true) };
  }

  // companies
  const insertResult = await dbSearchWorker.execute(sql`
    WITH batch AS (
      SELECT co.org_id, co.id, co.name, co.legal_name, co.registration_no, co.tax_id, co.updated_at, co.is_deleted
      FROM companies co
      WHERE (co.org_id, co.id) > (${co}, ${ci}::uuid)
      ORDER BY co.org_id, co.id
      LIMIT ${limit}
    ),
    inserted AS (
      INSERT INTO search_documents (org_id, entity_type, entity_id, title, subtitle, search_vector, updated_at, is_deleted)
      SELECT
        b.org_id,
        'companies'::text,
        b.id::text,
        b.name,
        COALESCE(b.legal_name, '') || ' ' || COALESCE(b.registration_no, ''),
        to_tsvector('simple',
          COALESCE(b.name, '') || ' ' ||
          COALESCE(b.legal_name, '') || ' ' ||
          COALESCE(b.registration_no, '') || ' ' ||
          COALESCE(b.tax_id, '')
        ),
        b.updated_at,
        b.is_deleted
      FROM batch b
      ON CONFLICT (org_id, entity_type, entity_id)
      DO UPDATE SET
        title = EXCLUDED.title,
        subtitle = EXCLUDED.subtitle,
        search_vector = EXCLUDED.search_vector,
        updated_at = EXCLUDED.updated_at,
        is_deleted = EXCLUDED.is_deleted
    )
    SELECT (SELECT count(*) FROM batch) AS cnt,
           (SELECT org_id FROM batch ORDER BY org_id, id DESC LIMIT 1) AS last_org,
           (SELECT id FROM batch ORDER BY org_id, id DESC LIMIT 1) AS last_id
  `);
  const rows = (insertResult as unknown as { rows?: { cnt: number; last_org: string | null; last_id: string | null }[] }).rows ?? [];
  const row = rows[0];
  const count = row?.cnt ?? 0;
  const done = count < limit;
  const lastOrg = row?.last_org ?? null;
  const lastId = row?.last_id ?? null;

  await dbSearchWorker.execute(sql`
    INSERT INTO search_backfill_state (entity_type, cursor_org_id, cursor_id, rows_processed, completed, updated_at)
    VALUES ('companies', ${lastOrg}, ${lastId}, ${count}, ${done}, now())
    ON CONFLICT (entity_type)
    DO UPDATE SET
      cursor_org_id = EXCLUDED.cursor_org_id,
      cursor_id = EXCLUDED.cursor_id,
      rows_processed = search_backfill_state.rows_processed + EXCLUDED.rows_processed,
      completed = EXCLUDED.completed,
      updated_at = now()
  `);

  return { entityType: 'companies', count, done, allDone: done };
}

/**
 * One-time full backfill (legacy / small datasets).
 * Use backfillSearchDocumentsChunk for production to avoid timeouts.
 */
export async function backfillSearchDocuments(): Promise<{ contacts: number; companies: number }> {
  const contactsResult = await dbSearchWorker.execute(sql`
    INSERT INTO search_documents (org_id, entity_type, entity_id, title, subtitle, search_vector, updated_at, is_deleted)
    SELECT
      c.org_id,
      'contacts'::text,
      c.id::text,
      c.name,
      COALESCE(c.email, '') || ' ' || COALESCE(c.company, ''),
      to_tsvector('simple',
        COALESCE(c.name, '') || ' ' ||
        COALESCE(c.email, '') || ' ' ||
        COALESCE(c.company, '') || ' ' ||
        COALESCE(c.phone, '')
      ),
      c.updated_at,
      c.is_deleted
    FROM contacts c
    ON CONFLICT (org_id, entity_type, entity_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      search_vector = EXCLUDED.search_vector,
      updated_at = EXCLUDED.updated_at,
      is_deleted = EXCLUDED.is_deleted
  `);

  const companiesResult = await dbSearchWorker.execute(sql`
    INSERT INTO search_documents (org_id, entity_type, entity_id, title, subtitle, search_vector, updated_at, is_deleted)
    SELECT
      co.org_id,
      'companies'::text,
      co.id::text,
      co.name,
      COALESCE(co.legal_name, '') || ' ' || COALESCE(co.registration_no, ''),
      to_tsvector('simple',
        COALESCE(co.name, '') || ' ' ||
        COALESCE(co.legal_name, '') || ' ' ||
        COALESCE(co.registration_no, '') || ' ' ||
        COALESCE(co.tax_id, '')
      ),
      co.updated_at,
      co.is_deleted
    FROM companies co
    ON CONFLICT (org_id, entity_type, entity_id)
    DO UPDATE SET
      title = EXCLUDED.title,
      subtitle = EXCLUDED.subtitle,
      search_vector = EXCLUDED.search_vector,
      updated_at = EXCLUDED.updated_at,
      is_deleted = EXCLUDED.is_deleted
  `);

  const contactsCount = (contactsResult as { rowCount?: number }).rowCount ?? 0;
  const companiesCount = (companiesResult as { rowCount?: number }).rowCount ?? 0;

  return { contacts: contactsCount, companies: companiesCount };
}
