import type { EntityContract } from 'afena-canon';

export const COMPANIES_CONTRACT: EntityContract = {
  entityType: 'companies',
  label: 'Company',
  labelPlural: 'Companies',
  hasLifecycle: false,
  hasSoftDelete: true,
  transitions: [
    // No lifecycle transitions — spine entity
  ],
  updateModes: ['edit', 'correct'],
  reasonRequired: [],
  workflowDecisions: [],
  primaryVerbs: ['update', 'delete'],
  secondaryVerbs: ['restore'],
};
