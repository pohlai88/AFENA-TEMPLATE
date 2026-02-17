import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { createHash } from 'crypto';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const url = process.env.DATABASE_URL_MIGRATIONS ?? process.env.DATABASE_URL;
if (!url) {
  console.error('No DATABASE_URL');
  process.exit(1);
}

const sql = neon(url);
const drizzleDir = join(process.cwd(), 'drizzle');

// Read journal
const journal = JSON.parse(readFileSync(join(drizzleDir, 'meta', '_journal.json'), 'utf8'));

// Get applied migrations
const applied = await sql`SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at`;
const appliedTimestamps = new Set(applied.map((r) => Number(r.created_at)));

console.log(`Applied: ${applied.length} migrations`);
console.log(`Journal: ${journal.entries.length} entries`);

// Find pending
const pending = journal.entries.filter((e) => !appliedTimestamps.has(e.when));
console.log(`\nPending: ${pending.length} migrations:`);
for (const e of pending) {
  console.log(`  [${e.idx}] ${e.tag} (when: ${e.when})`);
}

const mode = process.argv[2]; // 'backfill', 'verify', or nothing

if (mode === 'backfill') {
  // Backfill migrations that were already applied via db:push
  // These are 0014-0018 — their DDL already exists in the DB
  const toBackfill = pending.filter((e) => e.idx >= 14 && e.idx <= 18);
  console.log(`\nBackfilling ${toBackfill.length} migrations...`);

  for (const entry of toBackfill) {
    const sqlFile = readdirSync(drizzleDir).find(
      (f) => f.startsWith(entry.tag.split('_')[0] + '_') && f.endsWith('.sql'),
    );
    const filename = sqlFile || `${entry.tag}.sql`;
    const content = readFileSync(join(drizzleDir, filename), 'utf8');
    const hash = createHash('sha256').update(content).digest('hex');
    await sql`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES (${hash}, ${entry.when})`;
    console.log(`  Backfilled: ${entry.tag} (hash: ${hash.slice(0, 16)}...)`);
  }

  console.log(
    '\nDone. Now run `pnpm --filter afenda-database db:migrate` for remaining migrations.',
  );
} else if (mode === 'verify') {
  console.log('\n--- Verifying 0019 + 0020 DB state ---');
  const checks = await Promise.all([
    sql`SELECT indexname FROM pg_indexes WHERE indexname = 'role_perms_org_role_entity_verb_scope_idx'`,
    sql`SELECT indexname FROM pg_indexes WHERE indexname = 'role_perms_org_role_entity_verb_idx'`,
    sql`SELECT indexname FROM pg_indexes WHERE indexname = 'roles_org_key_idx'`,
    sql`SELECT conname, pg_get_constraintdef(oid) AS consrc FROM pg_constraint WHERE conname = 'role_perms_verb_valid'`,
    sql`SELECT tgname FROM pg_trigger WHERE tgname = 'trg_prevent_system_role'`,
    sql`SELECT proname FROM pg_proc WHERE proname = 'prevent_system_role_assignment'`,
    sql`SELECT proname FROM pg_proc WHERE proname = 'seed_org_defaults'`,
  ]);
  const pass = (v) => (v ? '✅' : '❌');
  console.log(
    `  New unique index (scope):  ${pass(checks[0][0]?.indexname)} ${checks[0][0]?.indexname ?? 'MISSING'}`,
  );
  console.log(
    `  Old unique index (no scope): ${pass(!checks[1][0]?.indexname)} ${checks[1][0]?.indexname ?? 'DROPPED'}`,
  );
  console.log(
    `  roles_org_key_idx:         ${pass(checks[2][0]?.indexname)} ${checks[2][0]?.indexname ?? 'MISSING'}`,
  );
  console.log(
    `  verb CHECK includes '*':   ${pass(checks[3][0]?.consrc?.includes("'*'"))} ${checks[3][0]?.consrc ?? 'MISSING'}`,
  );
  console.log(
    `  trg_prevent_system_role:   ${pass(checks[4][0]?.tgname)} ${checks[4][0]?.tgname ?? 'MISSING'}`,
  );
  console.log(
    `  prevent_system_role fn:    ${pass(checks[5][0]?.proname)} ${checks[5][0]?.proname ?? 'MISSING'}`,
  );
  console.log(
    `  seed_org_defaults fn:      ${pass(checks[6][0]?.proname)} ${checks[6][0]?.proname ?? 'MISSING'}`,
  );
} else {
  console.log('\nUsage: node check-migrations.mjs [backfill|verify]');
}
