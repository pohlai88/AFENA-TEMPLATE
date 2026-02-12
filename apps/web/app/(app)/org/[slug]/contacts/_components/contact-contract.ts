import type { EntityContract } from 'afena-canon';

export const CONTACT_CONTRACT: EntityContract = {
  entityType: 'contacts',
  label: 'Contact',
  labelPlural: 'Contacts',
  hasLifecycle: true,
  hasSoftDelete: true,
  transitions: [
    { from: 'draft', allowed: ['update', 'delete', 'submit'] },
    { from: 'submitted', allowed: ['approve', 'reject', 'cancel'] },
    { from: 'active', allowed: ['update', 'cancel', 'delete'] },
    { from: 'cancelled', allowed: ['restore'] },
  ],
  updateModes: ['edit', 'correct', 'amend', 'adjust'],
  reasonRequired: ['reject', 'cancel'],
  workflowDecisions: ['approve', 'reject'],
  primaryVerbs: ['update', 'submit', 'delete'],
  secondaryVerbs: ['restore'],
};
