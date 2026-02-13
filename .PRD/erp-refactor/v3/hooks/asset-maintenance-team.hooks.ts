// TanStack Query hooks for Asset Maintenance Team
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetMaintenanceTeam } from '../types/asset-maintenance-team.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetMaintenanceTeamListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Maintenance Team records.
 */
export function useAssetMaintenanceTeamList(
  params: AssetMaintenanceTeamListParams = {},
  options?: Omit<UseQueryOptions<AssetMaintenanceTeam[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetMaintenanceTeam.list(params),
    queryFn: () => apiGet<AssetMaintenanceTeam[]>(`/asset-maintenance-team${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Maintenance Team by ID.
 */
export function useAssetMaintenanceTeam(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetMaintenanceTeam | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetMaintenanceTeam.detail(id ?? ''),
    queryFn: () => apiGet<AssetMaintenanceTeam | null>(`/asset-maintenance-team/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Maintenance Team.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetMaintenanceTeam(
  options?: UseMutationOptions<AssetMaintenanceTeam, Error, Partial<AssetMaintenanceTeam>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetMaintenanceTeam>) => apiPost<AssetMaintenanceTeam>('/asset-maintenance-team', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceTeam.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Maintenance Team.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetMaintenanceTeam(
  options?: UseMutationOptions<AssetMaintenanceTeam, Error, { id: string; data: Partial<AssetMaintenanceTeam> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetMaintenanceTeam> }) =>
      apiPut<AssetMaintenanceTeam>(`/asset-maintenance-team/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceTeam.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceTeam.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Maintenance Team by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetMaintenanceTeam(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-maintenance-team/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetMaintenanceTeam.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
