/**
 * K-06: Action types are namespaced {entity}.{verb}.
 * Verb = last segment after final dot.
 * e.g. contacts.create → verb 'create', invoices.line.add → verb 'add'.
 */

/** Core verbs available for domain entities. */
export const ACTION_VERBS = [
  'create',
  'update',
  'delete',
  'restore',
  'merge',
  'archive',
  'approve',
  'reject',
  'submit',
  'lock',
  'unlock',
  'reassign',
  'transfer',
  'duplicate',
  'comment',
  'attach',
  'import',
] as const;
export type ActionVerb = (typeof ACTION_VERBS)[number];

/** Registered action types — all entity.verb pairs. */
export const ACTION_TYPES = [
  'contacts.create',
  'contacts.update',
  'contacts.delete',
  'contacts.restore',
  'contacts.submit',
  'contacts.cancel',
  'contacts.approve',
  'contacts.reject',
  'companies.create',
  'companies.update',
  'companies.delete',
  'companies.restore',
  'video-settings.create',
  'video-settings.update',
  'video-settings.delete',
  'video-settings.restore',
  'tasks.create',
  'tasks.update',
  'tasks.delete',
  'tasks.restore',
  'timesheets.create',
  'timesheets.update',
  'timesheets.delete',
  'timesheets.restore',
  'timesheet-details.create',
  'timesheet-details.update',
  'timesheet-details.delete',
  'timesheet-details.restore',
  'dependent-tasks.create',
  'dependent-tasks.update',
  'dependent-tasks.delete',
  'dependent-tasks.restore',
  'activity-types.create',
  'activity-types.update',
  'activity-types.delete',
  'activity-types.restore',
  'activity-costs.create',
  'activity-costs.update',
  'activity-costs.delete',
  'activity-costs.restore',
  'psoa-projects.create',
  'psoa-projects.update',
  'psoa-projects.delete',
  'psoa-projects.restore',
  'buying-settings.create',
  'buying-settings.update',
  'buying-settings.delete',
  'buying-settings.restore',
  'designations.create',
  'designations.update',
  'designations.delete',
  'designations.restore',
  // @entity-gen:action-types
] as const;
export type ActionType = (typeof ACTION_TYPES)[number];

/** Action family — groups verbs by semantic category. */
export const ACTION_FAMILIES = [
  'field_mutation',
  'state_transition',
  'ownership',
  'lifecycle',
  'annotation',
  'system',
] as const;
export type ActionFamily = (typeof ACTION_FAMILIES)[number];

/** Deterministic mapping from verb to action family. */
const VERB_TO_FAMILY: Record<string, ActionFamily> = {
  create: 'lifecycle',
  update: 'field_mutation',
  delete: 'lifecycle',
  restore: 'lifecycle',
  merge: 'lifecycle',
  archive: 'lifecycle',
  duplicate: 'lifecycle',
  approve: 'state_transition',
  reject: 'state_transition',
  submit: 'state_transition',
  lock: 'state_transition',
  unlock: 'state_transition',
  reassign: 'ownership',
  transfer: 'ownership',
  comment: 'annotation',
  attach: 'annotation',
  import: 'system',
};

/**
 * Extract the verb (last segment) from a namespaced action type.
 * e.g. 'contacts.create' → 'create', 'invoices.line.add' → 'add'
 */
export function extractVerb(actionType: string): string {
  const lastDot = actionType.lastIndexOf('.');
  if (lastDot === -1) return actionType;
  return actionType.slice(lastDot + 1);
}

/**
 * Extract the entity namespace from a namespaced action type.
 * e.g. 'contacts.create' → 'contacts', 'invoices.line.add' → 'invoices.line'
 */
export function extractEntityNamespace(actionType: string): string {
  const lastDot = actionType.lastIndexOf('.');
  if (lastDot === -1) return actionType;
  return actionType.slice(0, lastDot);
}

/**
 * Deterministic mapping from action type to action family.
 * Uses the verb portion (last segment) of the namespaced action type.
 */
export function getActionFamily(actionType: string): ActionFamily {
  const verb = extractVerb(actionType);
  return VERB_TO_FAMILY[verb] ?? 'system';
}
