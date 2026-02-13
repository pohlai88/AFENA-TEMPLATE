import { sql } from 'afena-database';

import type { Channel, GovernorPreset } from 'afena-canon';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

/**
 * Governor presets — transaction-scoped timeouts by context.
 * SET LOCAL ensures no leaks between pooled connections.
 */
export interface GovernorConfig {
  statementTimeoutMs: number;
  idleInTransactionTimeoutMs: number;
  applicationName: string;
}

const DEFAULT_INTERACTIVE: Omit<GovernorConfig, 'applicationName'> = {
  statementTimeoutMs: 5_000,
  idleInTransactionTimeoutMs: 20_000,
};

const DEFAULT_BACKGROUND: Omit<GovernorConfig, 'applicationName'> = {
  statementTimeoutMs: 30_000,
  idleInTransactionTimeoutMs: 60_000,
};

const DEFAULT_REPORTING: Omit<GovernorConfig, 'applicationName'> = {
  statementTimeoutMs: 5_000,
  idleInTransactionTimeoutMs: 20_000,
};

export type { GovernorPreset };

/**
 * Build governor config for a given context.
 */
export function buildGovernorConfig(
  preset: GovernorPreset,
  orgId: string,
  channel?: Channel,
): GovernorConfig {
  let base: Omit<GovernorConfig, 'applicationName'>;
  switch (preset) {
    case 'background':
      base = DEFAULT_BACKGROUND;
      break;
    case 'reporting':
      base = DEFAULT_REPORTING;
      break;
    default:
      base = DEFAULT_INTERACTIVE;
  }
  return {
    ...base,
    applicationName: `afena:${channel ?? 'web'}:org=${orgId}`,
  };
}

/**
 * Apply governor settings at the start of a transaction.
 * MUST be the first thing called inside db.transaction().
 *
 * Uses SET LOCAL — transaction-scoped, no leaks between pooled connections.
 * INVARIANT-GOVERNORS-01: every DB transaction sets timeouts + application_name.
 */
export async function applyGovernor(
  tx: NeonHttpDatabase,
  config: GovernorConfig,
): Promise<void> {
  await (tx as any).execute(
    sql`SET LOCAL statement_timeout = ${sql.raw(String(config.statementTimeoutMs))}`,
  );
  await (tx as any).execute(
    sql`SET LOCAL idle_in_transaction_session_timeout = ${sql.raw(String(config.idleInTransactionTimeoutMs))}`,
  );
  await (tx as any).execute(
    sql`SET LOCAL application_name = ${sql.raw(`'${escapeAppName(config.applicationName)}'`)}`,
  );
}

/**
 * Escape single quotes in application_name to prevent SQL injection.
 */
function escapeAppName(name: string): string {
  return name.replace(/'/g, "''");
}
