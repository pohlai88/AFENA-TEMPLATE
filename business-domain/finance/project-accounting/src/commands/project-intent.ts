import type { DomainIntent, ProjectCostPayload } from 'afenda-canon';

export function buildProjectCostPostingIntent(
  payload: ProjectCostPayload,
  idempotencyKey: string,
): DomainIntent {
  return { type: 'project.cost', payload, idempotencyKey };
}
