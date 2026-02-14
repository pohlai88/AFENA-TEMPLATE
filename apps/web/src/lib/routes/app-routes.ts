/**
 * App navigation route builders — SSOT for /org/... paths.
 * Use these instead of raw /org/ strings.
 */

/** Org dashboard: /org/[slug] */
export function org(slug: string): string {
  return `/org/${slug}`;
}

/** Entity list: /org/[slug]/[entityType] */
export function orgEntity(slug: string, entityType: string): string {
  return `/org/${slug}/${entityType}`;
}

/** Entity list trash: /org/[slug]/[entityType]/trash */
export function orgEntityTrash(slug: string, entityType: string): string {
  return `/org/${slug}/${entityType}/trash`;
}

/** New entity: /org/[slug]/[entityType]/new */
export function orgEntityNew(slug: string, entityType: string): string {
  return `/org/${slug}/${entityType}/new`;
}

/** Entity detail: /org/[slug]/[entityType]/[id] */
export function orgEntityId(slug: string, entityType: string, id: string): string {
  return `/org/${slug}/${entityType}/${id}`;
}

/** Entity edit: /org/[slug]/[entityType]/[id]/edit */
export function orgEntityEdit(slug: string, entityType: string, id: string): string {
  return `/org/${slug}/${entityType}/${id}/edit`;
}

/** Entity versions: /org/[slug]/[entityType]/[id]/versions */
export function orgEntityVersions(slug: string, entityType: string, id: string): string {
  return `/org/${slug}/${entityType}/${id}/versions`;
}

/** Entity audit: /org/[slug]/[entityType]/[id]/audit */
export function orgEntityAudit(slug: string, entityType: string, id: string): string {
  return `/org/${slug}/${entityType}/${id}/audit`;
}

/** Settings: /org/[slug]/settings */
export function orgSettings(slug: string): string {
  return `/org/${slug}/settings`;
}

/** Settings roles: /org/[slug]/settings/roles */
export function orgSettingsRoles(slug: string): string {
  return `/org/${slug}/settings/roles`;
}

/** Settings roles new: /org/[slug]/settings/roles/new */
export function orgSettingsRolesNew(slug: string): string {
  return `/org/${slug}/settings/roles/new`;
}

/** Settings role detail: /org/[slug]/settings/roles/[roleId] */
export function orgSettingsRoleId(slug: string, roleId: string): string {
  return `/org/${slug}/settings/roles/${roleId}`;
}

/** Settings workflows: /org/[slug]/settings/workflows */
export function orgSettingsWorkflows(slug: string): string {
  return `/org/${slug}/settings/workflows`;
}

/** Settings workflows new: /org/[slug]/settings/workflows/new */
export function orgSettingsWorkflowsNew(slug: string): string {
  return `/org/${slug}/settings/workflows/new`;
}

/** Settings workflows editor: /org/[slug]/settings/workflows/editor/[definitionId] */
export function orgSettingsWorkflowsEditor(slug: string, definitionId: string): string {
  return `/org/${slug}/settings/workflows/editor/${definitionId}`;
}

/** Settings workflows instance: /org/[slug]/settings/workflows/[definitionId] */
export function orgSettingsWorkflowId(slug: string, definitionId: string): string {
  return `/org/${slug}/settings/workflows/${definitionId}`;
}

/** Settings workflows health: /org/[slug]/settings/workflows/health */
export function orgSettingsWorkflowsHealth(slug: string): string {
  return `/org/${slug}/settings/workflows/health`;
}

/** Settings workflows instances: /org/[slug]/settings/workflows/instances */
export function orgSettingsWorkflowsInstances(slug: string): string {
  return `/org/${slug}/settings/workflows/instances`;
}

/** Settings workflows instance detail: /org/[slug]/settings/workflows/instances/[instanceId] */
export function orgSettingsWorkflowsInstanceId(slug: string, instanceId: string): string {
  return `/org/${slug}/settings/workflows/instances/${instanceId}`;
}

/**
 * Surface page template — Next.js route pattern with [slug].
 * Use for SURFACE.page when the route is /org/[slug]/...
 */
export function orgEntityPage(entityType: string): string {
  return `/org/[slug]/${entityType}`;
}

export function orgEntityTrashPage(entityType: string): string {
  return `/org/[slug]/${entityType}/trash`;
}

export function orgEntityNewPage(entityType: string): string {
  return `/org/[slug]/${entityType}/new`;
}

export function orgEntityIdPage(entityType: string): string {
  return `/org/[slug]/${entityType}/[id]`;
}

export function orgEntityEditPage(entityType: string): string {
  return `/org/[slug]/${entityType}/[id]/edit`;
}

export function orgEntityVersionsPage(entityType: string): string {
  return `/org/[slug]/${entityType}/[id]/versions`;
}

export function orgEntityAuditPage(entityType: string): string {
  return `/org/[slug]/${entityType}/[id]/audit`;
}
