/**
 * Accounting Hub Queries
 *
 * Real Drizzle queries against acct_events, acct_mappings,
 * acct_mapping_versions, and acct_derived_entries tables.
 */
import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { acctDerivedEntries, acctEvents, acctMappings, acctMappingVersions } from 'afenda-database';
import { and, desc, eq } from 'drizzle-orm';

/* ---------- Read Models ---------- */

export type AcctEventReadModel = {
  id: string;
  eventId: string;
  eventType: string;
  schemaVersion: number;
  sourcePackage: string;
  sourceDocumentId: string | null;
  sourceDocumentType: string | null;
  payload: unknown;
  currencyCode: string;
  correctsEventId: string | null;
};

export type MappingRuleSetReadModel = {
  mappingId: string;
  mappingCode: string;
  name: string;
  eventType: string;
  versionId: string;
  versionNumber: number;
  rules: unknown;
  rulesHash: string;
  isCurrent: boolean;
};

export type DerivedEntryReadModel = {
  id: string;
  derivationId: string;
  eventId: string;
  mappingVersionId: string;
  mappingVersionNumber: number;
  status: string;
  totalDebitMinor: number;
  totalCreditMinor: number;
  currencyCode: string;
  derivedLines: unknown;
  journalEntryId: string | null;
  errorDetails: string | null;
};

/* ---------- Queries ---------- */

export async function getAccountingEvent(
  db: DbSession,
  ctx: DomainContext,
  eventId: string,
): Promise<AcctEventReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: acctEvents.id,
        eventId: acctEvents.eventId,
        eventType: acctEvents.eventType,
        schemaVersion: acctEvents.schemaVersion,
        sourcePackage: acctEvents.sourcePackage,
        sourceDocumentId: acctEvents.sourceDocumentId,
        sourceDocumentType: acctEvents.sourceDocumentType,
        payload: acctEvents.payload,
        currencyCode: acctEvents.currencyCode,
        correctsEventId: acctEvents.correctsEventId,
      })
      .from(acctEvents)
      .where(and(eq(acctEvents.orgId, ctx.orgId), eq(acctEvents.eventId, eventId), eq(acctEvents.isDeleted, false))),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Accounting event not found: ${eventId}`, { eventId });
  }

  return rows[0]!;
}

export async function getCurrentMappingRules(
  db: DbSession,
  ctx: DomainContext,
  eventType: string,
): Promise<MappingRuleSetReadModel> {
  // Find the active mapping for this event type
  const mappingRows = await db.read((tx) =>
    tx
      .select({
        mappingId: acctMappings.id,
        mappingCode: acctMappings.mappingCode,
        name: acctMappings.name,
        eventType: acctMappings.eventType,
      })
      .from(acctMappings)
      .where(
        and(
          eq(acctMappings.orgId, ctx.orgId),
          eq(acctMappings.eventType, eventType),
          eq(acctMappings.isActive, true),
          eq(acctMappings.isDeleted, false),
        ),
      ),
  );

  if (mappingRows.length === 0) {
    throw new DomainError('NOT_FOUND', `No active mapping for event type: ${eventType}`, {
      eventType,
    });
  }

  const mapping = mappingRows[0]!;

  // Get the current version
  const versionRows = await db.read((tx) =>
    tx
      .select({
        versionId: acctMappingVersions.id,
        versionNumber: acctMappingVersions.versionNumber,
        rules: acctMappingVersions.rules,
        rulesHash: acctMappingVersions.rulesHash,
        isCurrent: acctMappingVersions.isCurrent,
      })
      .from(acctMappingVersions)
      .where(
        and(
          eq(acctMappingVersions.orgId, ctx.orgId),
          eq(acctMappingVersions.mappingId, mapping.mappingId),
          eq(acctMappingVersions.isCurrent, true),
          eq(acctMappingVersions.isDeleted, false),
        ),
      )
      .orderBy(desc(acctMappingVersions.versionNumber)),
  );

  if (versionRows.length === 0) {
    throw new DomainError('NOT_FOUND', `No current version for mapping: ${mapping.mappingCode}`);
  }

  const version = versionRows[0]!;

  return {
    mappingId: mapping.mappingId,
    mappingCode: mapping.mappingCode,
    name: mapping.name,
    eventType: mapping.eventType,
    versionId: version.versionId,
    versionNumber: version.versionNumber,
    rules: version.rules,
    rulesHash: version.rulesHash,
    isCurrent: version.isCurrent,
  };
}

export async function getDerivedEntries(
  db: DbSession,
  ctx: DomainContext,
  eventId: string,
): Promise<DerivedEntryReadModel[]> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: acctDerivedEntries.id,
        derivationId: acctDerivedEntries.derivationId,
        eventId: acctDerivedEntries.eventId,
        mappingVersionId: acctDerivedEntries.mappingVersionId,
        mappingVersionNumber: acctDerivedEntries.mappingVersionNumber,
        status: acctDerivedEntries.status,
        totalDebitMinor: acctDerivedEntries.totalDebitMinor,
        totalCreditMinor: acctDerivedEntries.totalCreditMinor,
        currencyCode: acctDerivedEntries.currencyCode,
        derivedLines: acctDerivedEntries.derivedLines,
        journalEntryId: acctDerivedEntries.journalEntryId,
        errorDetails: acctDerivedEntries.errorDetails,
      })
      .from(acctDerivedEntries)
      .where(and(eq(acctDerivedEntries.orgId, ctx.orgId), eq(acctDerivedEntries.eventId, eventId), eq(acctDerivedEntries.isDeleted, false)))
      .orderBy(desc(acctDerivedEntries.createdAt)),
  );

  return rows.map((r) => ({
    ...r,
    totalDebitMinor: Number(r.totalDebitMinor),
    totalCreditMinor: Number(r.totalCreditMinor),
  }));
}

export async function getDerivedEntryByDerivationId(
  db: DbSession,
  ctx: DomainContext,
  derivationId: string,
): Promise<DerivedEntryReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        id: acctDerivedEntries.id,
        derivationId: acctDerivedEntries.derivationId,
        eventId: acctDerivedEntries.eventId,
        mappingVersionId: acctDerivedEntries.mappingVersionId,
        mappingVersionNumber: acctDerivedEntries.mappingVersionNumber,
        status: acctDerivedEntries.status,
        totalDebitMinor: acctDerivedEntries.totalDebitMinor,
        totalCreditMinor: acctDerivedEntries.totalCreditMinor,
        currencyCode: acctDerivedEntries.currencyCode,
        derivedLines: acctDerivedEntries.derivedLines,
        journalEntryId: acctDerivedEntries.journalEntryId,
        errorDetails: acctDerivedEntries.errorDetails,
      })
      .from(acctDerivedEntries)
      .where(
        and(
          eq(acctDerivedEntries.orgId, ctx.orgId),
          eq(acctDerivedEntries.derivationId, derivationId),
          eq(acctDerivedEntries.isDeleted, false),
        ),
      ),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Derived entry not found: ${derivationId}`, {
      derivationId,
    });
  }

  const r = rows[0]!;
  return {
    ...r,
    totalDebitMinor: Number(r.totalDebitMinor),
    totalCreditMinor: Number(r.totalCreditMinor),
  };
}
