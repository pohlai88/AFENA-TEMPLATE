// TanStack Query hooks for Bisect Nodes
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BisectNodes } from '../types/bisect-nodes.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BisectNodesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bisect Nodes records.
 */
export function useBisectNodesList(
  params: BisectNodesListParams = {},
  options?: Omit<UseQueryOptions<BisectNodes[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bisectNodes.list(params),
    queryFn: () => apiGet<BisectNodes[]>(`/bisect-nodes${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bisect Nodes by ID.
 */
export function useBisectNodes(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BisectNodes | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bisectNodes.detail(id ?? ''),
    queryFn: () => apiGet<BisectNodes | null>(`/bisect-nodes/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bisect Nodes.
 * Automatically invalidates list queries on success.
 */
export function useCreateBisectNodes(
  options?: UseMutationOptions<BisectNodes, Error, Partial<BisectNodes>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BisectNodes>) => apiPost<BisectNodes>('/bisect-nodes', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bisectNodes.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bisect Nodes.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBisectNodes(
  options?: UseMutationOptions<BisectNodes, Error, { id: string; data: Partial<BisectNodes> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BisectNodes> }) =>
      apiPut<BisectNodes>(`/bisect-nodes/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bisectNodes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bisectNodes.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bisect Nodes by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBisectNodes(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bisect-nodes/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bisectNodes.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
