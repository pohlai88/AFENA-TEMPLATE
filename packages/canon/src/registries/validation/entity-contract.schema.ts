/**
 * Zod schema for EntityContract validation
 */

import { z } from 'zod';
import { docStatusSchema } from '../../enums/doc-status';
import { updateModeSchema } from '../../enums/update-mode';

// Import ActionKind type to build schema
const actionKindSchema = z.enum([
  'create',
  'update',
  'delete',
  'restore',
  'submit',
  'cancel',
  'approve',
  'reject',
]);

export const lifecycleTransitionSchema = z.object({
  from: docStatusSchema,
  allowed: z.array(actionKindSchema),
});

export const entityContractSchema = z.object({
  entityType: z.string().min(1),
  label: z.string().min(1),
  labelPlural: z.string().min(1),
  hasLifecycle: z.boolean(),
  hasSoftDelete: z.boolean(),
  transitions: z.array(lifecycleTransitionSchema),
  updateModes: z.array(updateModeSchema),
  reasonRequired: z.array(z.union([actionKindSchema, updateModeSchema])),
  workflowDecisions: z.array(actionKindSchema),
  primaryVerbs: z.array(actionKindSchema),
  secondaryVerbs: z.array(actionKindSchema),
}).strict();
