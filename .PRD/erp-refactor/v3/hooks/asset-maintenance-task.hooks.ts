// TanStack Query hooks for Asset Maintenance Task
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetMaintenanceTask } from '../types/asset-maintenance-task.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetMaintenanceTaskListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Maintenance Task records.
 */
export function useAssetMaintenanceTaskList(
  params: AssetMaintenanceTaskListParams = {},
  options?: Omit<UseQueryOptions<AssetMaintenanceTask[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetMaintenanceTask.list(params),
    queryFn: () => apiGet<AssetMaintenanceTask[]>(`/asset-maintenance-task${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Maintenance Task by ID.
 */
export function useAssetMaintenanceTask(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetMaintenanceTask | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetMaintenanceTask.detail(id ?? ''),
    queryFn: () => apiGet<AssetMaintenanceTask | null>(`/asset-maintenance-task/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Maintenance Task.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetMaintenanceTask(
  options?: UseMutationOptions<AssetMaintenanceTask, Error, Partial<AssetMaintenanceTask>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetMaintenanceTask>) => apiPost<AssetMaintenanceTask>('/asset-maintenance-task', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceTask.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Maintenance Task.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetMaintenanceTask(
  options?: UseMutationOptions<AssetMaintenanceTask, Error, { id: string; data: Partial<AssetMaintenanceTask> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetMaintenanceTask> }) =>
      apiPut<AssetMaintenanceTask>(`/asset-maintenance-task/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceTask.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceTask.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Maintenance Task by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetMaintenanceTask(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-maintenance-task/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceTask.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
