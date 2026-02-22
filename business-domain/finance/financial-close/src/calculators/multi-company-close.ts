import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * FC-05 — Multi-Company Close Sequencing
 *
 * Determines entity-level → group-level close order based on dependencies.
 * Pure function — no I/O.
 */

export type CompanyCloseStatus = {
  companyId: string;
  name: string;
  level: 'entity' | 'sub_group' | 'group';
  dependsOn: string[];
  status: 'not_started' | 'in_progress' | 'completed';
};

export type CloseSequenceResult = {
  executionOrder: CompanyCloseStatus[];
  readyToStart: CompanyCloseStatus[];
  blocked: CompanyCloseStatus[];
  allComplete: boolean;
};

export function sequenceMultiCompanyClose(companies: CompanyCloseStatus[]): CalculatorResult<CloseSequenceResult> {
  if (companies.length === 0) throw new DomainError('VALIDATION_FAILED', 'No companies provided');

  const completedIds = new Set(companies.filter((c) => c.status === 'completed').map((c) => c.companyId));
  const sorted = [...companies].sort((a, b) => {
    const levelOrder = { entity: 0, sub_group: 1, group: 2 };
    return levelOrder[a.level] - levelOrder[b.level];
  });

  const readyToStart = sorted.filter((c) => c.status !== 'completed' && c.dependsOn.every((d) => completedIds.has(d)));
  const blocked = sorted.filter((c) => c.status !== 'completed' && !c.dependsOn.every((d) => completedIds.has(d)));

  return {
    result: { executionOrder: sorted, readyToStart, blocked, allComplete: companies.every((c) => c.status === 'completed') },
    inputs: { count: companies.length },
    explanation: `Multi-company close: ${readyToStart.length} ready, ${blocked.length} blocked, ${completedIds.size} complete`,
  };
}
