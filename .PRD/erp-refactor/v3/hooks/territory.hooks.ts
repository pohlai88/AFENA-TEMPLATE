// TanStack Query hooks for Territory
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Territory } from '../types/territory.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TerritoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Territory records.
 */
export function useTerritoryList(
  params: TerritoryListParams = {},
  options?: Omit<UseQueryOptions<Territory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.territory.list(params),
    queryFn: () => apiGet<Territory[]>(`/territory${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Territory by ID.
 */
export function useTerritory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Territory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.territory.detail(id ?? ''),
    queryFn: () => apiGet<Territory | null>(`/territory/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Territory.
 * Automatically invalidates list queries on success.
 */
export function useCreateTerritory(
  options?: UseMutationOptions<Territory, Error, Partial<Territory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Territory>) => apiPost<Territory>('/territory', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.territory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Territory.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTerritory(
  options?: UseMutationOptions<Territory, Error, { id: string; data: Partial<Territory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Territory> }) =>
      apiPut<Territory>(`/territory/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.territory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.territory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Territory by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTerritory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/territory/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.territory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
