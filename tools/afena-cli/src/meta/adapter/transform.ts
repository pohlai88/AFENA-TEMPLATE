/**
 * Stage 2 — Transform: neutral canonical intermediate.
 * Output: .afena/meta/staged/transformed.entities.json
 * Rules: money→bigint hint; datetime→timestamptz; field naming→snake; entityType→slug.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { nameToEntityType } from './utils';

function fieldnameToSnake(fieldname: string): string {
  return fieldname.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

export async function runTransform(repoRoot: string): Promise<void> {
  const rawPath = join(repoRoot, '.afena', 'meta', 'raw', 'refactor.entities.json');
  const outDir = join(repoRoot, '.afena', 'meta', 'staged');

  if (!existsSync(rawPath)) {
    throw new Error('Run afena meta scan first');
  }

  mkdirSync(outDir, { recursive: true });

  const raw = JSON.parse(readFileSync(rawPath, 'utf-8'));
  const transformed: Record<string, unknown> = {};

  for (const [name, entity] of Object.entries(raw.entities ?? {}) as [string, any][]) {
    const slug = nameToEntityType(name);
    const fields = (entity.fields ?? []).map((f: any) => {
      let fieldType = f.fieldtype;
      if (fieldType === 'datetime') fieldType = 'timestamptz';
      if (fieldType === 'check') fieldType = 'boolean';
      if (fieldType === 'data') fieldType = 'string';
      if (fieldType === 'small_text' || fieldType === 'text_editor') fieldType = 'text';
      if (fieldType === 'duration') fieldType = 'int';
      if (fieldType === 'select' && f.optionsParsed?.choices) fieldType = 'enum';
      const out: Record<string, unknown> = {
        fieldname: f.fieldname,
        fieldType,
        label: f.label ?? f.fieldname,
        required: f.requiredStatic ?? false,
        snakeName: fieldnameToSnake(f.fieldname),
        enumChoices: f.optionsParsed?.choices,
      };
      if (fieldType === 'link' && f.optionsParsed) {
        out.linkOptions = f.optionsParsed; // { kind: 'link', target: 'Account' } for map resolution
      }
      return out;
    });

    transformed[slug] = {
      doctypeId: entity.doctypeId,
      name: entity.name,
      entityType: slug,
      kind: entity.identity?.isSubmittable ? 'doc' : name.toLowerCase().includes('settings') ? 'config' : 'master',
      fields,
      fieldOrder: entity.fieldOrder ?? fields.map((f: any) => f.fieldname),
      dbNameMap: raw.manifestDbNameMap?.[name] ?? {},
    };
  }

  writeFileSync(
    join(outDir, 'transformed.entities.json'),
    JSON.stringify({ transformedAt: new Date().toISOString(), entities: transformed }, null, 2),
  );
}
