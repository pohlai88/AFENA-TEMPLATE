import type { UpdateMode } from '../enums/update-mode';

/**
 * ActionKind — the set of verbs and workflow decisions
 * that can appear in the enterprise action model.
 */
export type ActionKind =
  | 'create'
  | 'update'
  | 'delete'
  | 'restore'
  | 'submit'
  | 'cancel'
  | 'approve'
  | 'reject'
  | 'reverse'; // Financial document reversal (ERP safety pattern)

/**
 * ActionGroup — how actions are grouped in the UI.
 * Primary: main action bar buttons.
 * Secondary: overflow / dropdown actions.
 * Workflow: gated state-transition buttons (approve/reject).
 */
export type ActionGroup = 'primary' | 'secondary' | 'workflow';

/**
 * ResolvedAction — a single action the server has determined
 * the current actor may perform on the current entity.
 */
export interface ResolvedAction {
  kind: ActionKind;
  group: ActionGroup;
  label: string;
  icon: string; // lucide icon name
  variant: 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost';
  severity: 'info' | 'warning' | 'critical';
  requiresConfirm: boolean;
  requiresReason: boolean;
  requiresTypedConfirm?: string; // e.g. "DELETE"
}

/**
 * ResolvedUpdateMode — a single update mode the server has
 * determined is available for the current entity + actor.
 */
export interface ResolvedUpdateMode {
  mode: UpdateMode;
  label: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  requiresReason: boolean;
}

/**
 * ResolvedActions — the complete set of actions the UI may render.
 * Client renders ONLY what the server resolver returns.
 */
export interface ResolvedActions {
  primary: ResolvedAction[];
  secondary: ResolvedAction[];
  workflow: ResolvedAction[];
  updateModes: ResolvedUpdateMode[];
}

/**
 * ActionEnvelope — canonical mutation payload sent from client to server.
 * Every server action accepts this shape (or derives it from formData).
 */
export interface ActionEnvelope {
  clientActionId: string; // uuid v4
  orgId: string;
  entityType: string;
  entityId?: string;
  kind: ActionKind;
  updateMode?: UpdateMode;
  reason?: string;
}
