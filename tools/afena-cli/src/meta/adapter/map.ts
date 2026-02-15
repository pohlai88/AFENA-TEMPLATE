/**
 * Stage 5 — Mapping: apply mapping table + policies → LocalEntitySpec candidates.
 * Input: transfer bundle (from analyze); mapping.table.json; policies.ts; spine-denylist
 * Output: .afena/meta/staged/spec-candidates.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { MONEY_POLICY, RESERVED_WORD_POLICY } from 'afena-canon';
import { getAdapterVersion, buildInputsHash, loadOverrides, entityTypeToTableName, nameToEntityType } from './utils';

const DEFAULT_FIELD_RENAMES: Record<string, string> = {
  creation: 'created_at',
  modified: 'updated_at',
  docstatus: 'posting_status',
  deleted: 'is_deleted',
  owner: 'created_by',
  modified_by: 'updated_by',
};

export type EmitLockedSpecs = 'none' | 'ui' | 'all';

export async function runMap(repoRoot: string, emitLockedSpecs: EmitLockedSpecs = 'none'): Promise<void> {
  const stagedPath = join(repoRoot, '.afena', 'meta', 'staged', 'transformed.entities.json');
  const analyzePath = join(repoRoot, '.afena', 'meta', 'reports', 'analyze.json');
  const rawPath = join(repoRoot, '.afena', 'meta', 'raw', 'refactor.entities.json');
  const mappingPath = join(repoRoot, 'packages', 'canon', 'src', 'adapters', 'erpnext', 'mapping.table.json');
  const policiesPath = join(repoRoot, 'packages', 'canon', 'src', 'adapters', 'erpnext', 'policies.ts');
  const spinePath = join(repoRoot, 'packages', 'canon', 'src', 'adapters', 'erpnext', 'spine-denylist.json');
  const outDir = join(repoRoot, '.afena', 'meta', 'staged');

  if (!existsSync(stagedPath)) throw new Error('Run afena meta transform first');
  if (!existsSync(analyzePath)) throw new Error('Run afena meta analyze first');

  mkdirSync(outDir, { recursive: true });

  const staged = JSON.parse(readFileSync(stagedPath, 'utf-8'));
  const analyze = JSON.parse(readFileSync(analyzePath, 'utf-8'));
  let rawRefactor: unknown = {};
  if (existsSync(rawPath)) rawRefactor = JSON.parse(readFileSync(rawPath, 'utf-8'));
  let mappingTable: Record<string, unknown> = {};
  if (existsSync(mappingPath)) mappingTable = JSON.parse(readFileSync(mappingPath, 'utf-8'));
  let policiesContent = '';
  if (existsSync(policiesPath)) policiesContent = readFileSync(policiesPath, 'utf-8');
  const overrides = loadOverrides(repoRoot);
  let spineDenylist: unknown = {};
  if (existsSync(spinePath)) spineDenylist = JSON.parse(readFileSync(spinePath, 'utf-8'));

  const adapterVersion = getAdapterVersion(repoRoot);
  const inputsHash = buildInputsHash({
    rawRefactor,
    staged,
    analyze,
    mappingTable,
    policiesContent,
    overrides,
    spineDenylist,
  });

  const reservedWordsFromTable = (mappingTable.reservedWords as Record<string, string>) ?? {};
  const fieldRenames = { ...DEFAULT_FIELD_RENAMES, ...(mappingTable.fieldRenames as Record<string, string>) };
  const reservedWords = new Set([...RESERVED_WORD_POLICY.words, ...Object.keys(reservedWordsFromTable)]);

  /** MONEY_POLICY: currency always; float only when fieldname suggests amount. */
  const isMoneyField = (f: { fieldType?: string; fieldname?: string }) =>
    f.fieldType === 'currency' || (f.fieldType === 'float' && /amount|price|total|balance|credit|debit/i.test(f.fieldname ?? ''));

  const reportByEntity = new Map((analyze.reports ?? []).map((r: any) => [r.entityType, r]));
  const allEntityTypes = new Set(Object.keys(staged.entities ?? {}));
  const candidates: Record<string, unknown> = {};

  for (const [entityType, entity] of Object.entries(staged.entities ?? {}) as [string, any][]) {
    const report = reportByEntity.get(entityType) as { decision?: string; lockLevel?: string; outputsAllowed?: { spec: boolean } } | undefined;
    if (report?.decision === 'SKIP_ALL') continue;
    if (report?.decision === 'FAIL') continue;
    if (report?.decision === 'SKIP_DB' && emitLockedSpecs === 'none') continue;
    if (report?.lockLevel && emitLockedSpecs === 'none') continue; // legacy: lockLevel without decision

    const tableName = entityTypeToTableName(entityType);
    const reservedWordMap = { ...reservedWordsFromTable, ...entity.dbNameMap } as Record<string, string>;

    const fields = (entity.fields ?? [])
      .filter((f: any) => !String(f.fieldType).startsWith('layout:'))
      .map((f: any) => {
      let fieldType: unknown = f.fieldType;
      if (f.fieldType === 'float') fieldType = 'decimal';
      if (f.fieldType === 'link') {
        const linkOpts = f.linkOptions ?? {};
        const targetDoctype = linkOpts.target as string | undefined;
        const targetEntityType = targetDoctype ? nameToEntityType(targetDoctype) : undefined;
        const resolved = targetEntityType && allEntityTypes.has(targetEntityType);
        fieldType = {
          type: 'link' as const,
          targetEntityType: targetEntityType ?? undefined,
          staged: !resolved,
          storage: resolved ? ('uuid' as const) : ('text' as const),
          refSource: 'doctype' as const,
        };
      } else if (isMoneyField(f) && MONEY_POLICY.type === 'bigint') {
        fieldType = 'bigint';
      }
      let dbName = fieldRenames[f.fieldname] ?? reservedWordMap[f.fieldname] ?? f.snakeName ?? f.fieldname;
      if (reservedWords.has(f.fieldname) && !reservedWordMap[f.fieldname]) {
        dbName = reservedWordsFromTable[f.fieldname] ?? `${f.fieldname}${RESERVED_WORD_POLICY.suffix}`;
      }
      return {
        fieldname: f.fieldname,
        fieldType,
        label: f.label,
        required: f.required,
        dbName,
        source: 'refactor' as const,
        enumChoices: f.enumChoices,
      };
    });

    // Inject base entity fields (TENANCY-01)
    const injected = [
      { fieldname: 'org_id', fieldType: 'uuid' as const, label: 'Organization', required: true, dbName: 'org_id', source: 'local' as const },
      { fieldname: 'id', fieldType: 'uuid' as const, label: 'ID', required: true, dbName: 'id', source: 'local' as const },
      { fieldname: 'created_at', fieldType: 'timestamptz' as const, label: 'Created', required: false, dbName: 'created_at', source: 'local' as const },
      { fieldname: 'updated_at', fieldType: 'timestamptz' as const, label: 'Updated', required: false, dbName: 'updated_at', source: 'local' as const },
      { fieldname: 'version', fieldType: 'int' as const, label: 'Version', required: false, dbName: 'version', source: 'local' as const },
      { fieldname: 'is_deleted', fieldType: 'boolean' as const, label: 'Deleted', required: false, dbName: 'is_deleted', source: 'local' as const },
    ];
    for (const inj of injected) {
      if (!fields.some((f: any) => f.fieldname === inj.fieldname)) {
        fields.unshift(inj);
      }
    }

    let candidate: Record<string, unknown> = {
      entityType,
      kind: entity.kind ?? 'master',
      table: {
        name: tableName,
        pk: ['org_id', 'id'],
        tenancy: true,
        reservedWordMap,
        indexes: [],
      },
      fields,
      ui: {
        groups: [],
        order: (entity.fieldOrder ?? fields.map((f: any) => f.fieldname)).filter((fn: string) =>
          fields.some((f: any) => f.fieldname === fn),
        ),
        dependsOn: [],
      },
      sourceMap: {},
      meta: {
        adapterVersion,
        inputsHash,
        generatedAt: new Date().toISOString(),
        source: { doctypeId: entity.doctypeId ?? '', name: entity.name ?? entityType },
      },
    };

    // Merge overrides/<entityType>.override.json
    const override = overrides[entityType] as Record<string, unknown> | undefined;
    if (override) {
      if (override.fields && Array.isArray(override.fields)) {
        const fieldMap = new Map((candidate.fields as any[]).map((f: any) => [f.fieldname, f]));
        for (const o of override.fields as any[]) {
          const existing = fieldMap.get(o.fieldname);
          if (existing) Object.assign(existing, o);
          else if (o.fieldname) (candidate.fields as any[]).push(o);
        }
      }
      if (override.ui && typeof override.ui === 'object') {
        candidate.ui = { ...(candidate.ui as object), ...override.ui };
      }
      if (override.table?.reservedWordMap && typeof override.table.reservedWordMap === 'object') {
        (candidate.table as any).reservedWordMap = { ...(candidate.table as any).reservedWordMap, ...override.table.reservedWordMap };
      }
    }

    candidates[entityType] = candidate;
  }

  writeFileSync(
    join(outDir, 'spec-candidates.json'),
    JSON.stringify({ mappedAt: new Date().toISOString(), candidates }, null, 2),
  );
}
