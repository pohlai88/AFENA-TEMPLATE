import type { ActionKind } from './action-spec';
import type { DocStatus } from '../enums/doc-status';
import type { UpdateMode } from '../enums/update-mode';

/**
 * Lifecycle transition — defines which verbs/decisions
 * are allowed from a given doc status.
 */
export interface LifecycleTransition {
  from: DocStatus;
  allowed: ActionKind[];
}

/**
 * EntityContract — declares the full action model for an entity type.
 * Used by the ActionResolver to determine which actions are available.
 */
export interface EntityContract {
  /** Entity type identifier (e.g. 'contacts', 'invoices'). */
  entityType: string;

  /** Display name for the entity (e.g. 'Contact', 'Invoice'). */
  label: string;

  /** Plural display name (e.g. 'Contacts', 'Invoices'). */
  labelPlural: string;

  /** Whether this entity uses doc_status lifecycle. */
  hasLifecycle: boolean;

  /** Whether this entity supports soft delete (is_deleted flag). */
  hasSoftDelete: boolean;

  /** Lifecycle transitions — which verbs are allowed per status. */
  transitions: LifecycleTransition[];

  /** Update modes supported by this entity. */
  updateModes: UpdateMode[];

  /** Verbs/modes that require a reason (policy-driven mandatory). */
  reasonRequired: (ActionKind | UpdateMode)[];

  /** Workflow decisions this entity supports (e.g. approve, reject). */
  workflowDecisions: ActionKind[];

  /** Default verb order for primary action bar. */
  primaryVerbs: ActionKind[];

  /** Default verb order for secondary (overflow) actions. */
  secondaryVerbs: ActionKind[];
}
