// TanStack Query hooks for Workstation Cost
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WorkstationCost } from '../types/workstation-cost.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkstationCostListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Workstation Cost records.
 */
export function useWorkstationCostList(
  params: WorkstationCostListParams = {},
  options?: Omit<UseQueryOptions<WorkstationCost[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workstationCost.list(params),
    queryFn: () => apiGet<WorkstationCost[]>(`/workstation-cost${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Workstation Cost by ID.
 */
export function useWorkstationCost(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WorkstationCost | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workstationCost.detail(id ?? ''),
    queryFn: () => apiGet<WorkstationCost | null>(`/workstation-cost/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Workstation Cost.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkstationCost(
  options?: UseMutationOptions<WorkstationCost, Error, Partial<WorkstationCost>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkstationCost>) => apiPost<WorkstationCost>('/workstation-cost', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationCost.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Workstation Cost.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkstationCost(
  options?: UseMutationOptions<WorkstationCost, Error, { id: string; data: Partial<WorkstationCost> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkstationCost> }) =>
      apiPut<WorkstationCost>(`/workstation-cost/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationCost.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationCost.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Workstation Cost by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkstationCost(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/workstation-cost/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationCost.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
