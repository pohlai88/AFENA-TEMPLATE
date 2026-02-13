import { cache } from 'react';

import {
  listWorkflowDefinitions,
  listDefinitionVersions,
  getWorkflowDefinition,
  listWorkflowInstances,
  getWorkflowInstance,
  getWorkflowInstanceSteps,
  getWorkflowHealthStats,
  listPendingApprovals,
} from '@/app/actions/workflows';

export interface WorkflowDefinitionSummary {
  id: string;
  entityType: string;
  name: string;
  version: number;
  status: string;
  isDefault: boolean;
  definitionKind: string;
  compiledHash: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowInstanceSummary {
  id: string;
  entityType: string;
  entityId: string;
  definitionId: string;
  definitionVersion: number;
  status: string;
  currentNodes: string[];
  entityVersion: number;
  createdAt: string;
  completedAt: string | null;
}

export const fetchWorkflowDefinitions = cache(async (entityType?: string): Promise<WorkflowDefinitionSummary[]> => {
  const response = await listWorkflowDefinitions(entityType);
  if (!response.ok) return [];
  return (response.data ?? []) as unknown as WorkflowDefinitionSummary[];
});

export const fetchWorkflowDefinition = cache(async (id: string, version?: number) => {
  const response = await getWorkflowDefinition(id, version);
  if (!response.ok) return null;
  return response.data;
});

export const fetchWorkflowInstances = cache(async (entityType?: string, status?: string): Promise<WorkflowInstanceSummary[]> => {
  const response = await listWorkflowInstances(entityType, status);
  if (!response.ok) return [];
  return (response.data ?? []) as unknown as WorkflowInstanceSummary[];
});

export const fetchWorkflowInstance = cache(async (instanceId: string) => {
  const response = await getWorkflowInstance(instanceId);
  if (!response.ok) return null;
  return response.data;
});

export const fetchWorkflowSteps = cache(async (instanceId: string) => {
  const response = await getWorkflowInstanceSteps(instanceId);
  if (!response.ok) return [];
  return response.data ?? [];
});

export const fetchHealthStats = cache(async () => {
  const response = await getWorkflowHealthStats();
  if (!response.ok) return null;
  return response.data;
});

export const fetchPendingApprovals = cache(async (actorUserId: string) => {
  const response = await listPendingApprovals(actorUserId);
  if (!response.ok) return [];
  return response.data ?? [];
});

export const fetchDefinitionVersions = cache(async (entityType: string, name: string): Promise<WorkflowDefinitionSummary[]> => {
  const response = await listDefinitionVersions(entityType, name);
  if (!response.ok) return [];
  return (response.data ?? []) as unknown as WorkflowDefinitionSummary[];
});
