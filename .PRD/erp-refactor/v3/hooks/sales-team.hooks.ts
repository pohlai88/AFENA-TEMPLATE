// TanStack Query hooks for Sales Team
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesTeam } from '../types/sales-team.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesTeamListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Team records.
 */
export function useSalesTeamList(
  params: SalesTeamListParams = {},
  options?: Omit<UseQueryOptions<SalesTeam[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesTeam.list(params),
    queryFn: () => apiGet<SalesTeam[]>(`/sales-team${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Team by ID.
 */
export function useSalesTeam(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesTeam | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesTeam.detail(id ?? ''),
    queryFn: () => apiGet<SalesTeam | null>(`/sales-team/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Team.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesTeam(
  options?: UseMutationOptions<SalesTeam, Error, Partial<SalesTeam>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesTeam>) => apiPost<SalesTeam>('/sales-team', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTeam.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Team.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesTeam(
  options?: UseMutationOptions<SalesTeam, Error, { id: string; data: Partial<SalesTeam> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesTeam> }) =>
      apiPut<SalesTeam>(`/sales-team/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTeam.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTeam.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Team by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesTeam(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-team/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesTeam.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
