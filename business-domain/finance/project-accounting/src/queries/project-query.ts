import type { DomainContext } from 'afenda-canon';
import { DomainError } from 'afenda-canon';
import type { DbSession } from 'afenda-database';
import { projects } from 'afenda-database';
import { and, eq } from 'drizzle-orm';

export type ProjectReadModel = {
  projectId: string;
  code: string;
  name: string;
  status: string;
  startDateIso: string;
  endDateIso: string;
};

export async function getProject(
  db: DbSession,
  ctx: DomainContext,
  projectId: string,
): Promise<ProjectReadModel> {
  const rows = await db.read((tx) =>
    tx
      .select({
        projectId: projects.id,
        code: projects.code,
        name: projects.name,
        status: projects.status,
        startDateIso: projects.startDate,
        endDateIso: projects.endDate,
      })
      .from(projects)
      .where(
        and(
          eq(projects.orgId, ctx.orgId),
          eq(projects.id, projectId),
          eq(projects.isDeleted, false),
        ),
      )
      .limit(1),
  );

  if (rows.length === 0) {
    throw new DomainError('NOT_FOUND', `Project not found: ${projectId}`, { projectId });
  }

  const r = rows[0]!;
  return {
    projectId: r.projectId,
    code: r.code,
    name: r.name,
    status: r.status,
    startDateIso: String(r.startDateIso ?? ''),
    endDateIso: String(r.endDateIso ?? ''),
  };
}
