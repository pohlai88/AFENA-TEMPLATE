// TanStack Query hooks for Global Defaults
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { GlobalDefaults } from '../types/global-defaults.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface GlobalDefaultsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Global Defaults records.
 */
export function useGlobalDefaultsList(
  params: GlobalDefaultsListParams = {},
  options?: Omit<UseQueryOptions<GlobalDefaults[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.globalDefaults.list(params),
    queryFn: () => apiGet<GlobalDefaults[]>(`/global-defaults${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Global Defaults by ID.
 */
export function useGlobalDefaults(
  id: string | undefined,
  options?: Omit<UseQueryOptions<GlobalDefaults | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.globalDefaults.detail(id ?? ''),
    queryFn: () => apiGet<GlobalDefaults | null>(`/global-defaults/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Global Defaults.
 * Automatically invalidates list queries on success.
 */
export function useCreateGlobalDefaults(
  options?: UseMutationOptions<GlobalDefaults, Error, Partial<GlobalDefaults>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<GlobalDefaults>) => apiPost<GlobalDefaults>('/global-defaults', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.globalDefaults.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Global Defaults.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateGlobalDefaults(
  options?: UseMutationOptions<GlobalDefaults, Error, { id: string; data: Partial<GlobalDefaults> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GlobalDefaults> }) =>
      apiPut<GlobalDefaults>(`/global-defaults/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.globalDefaults.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.globalDefaults.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Global Defaults by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteGlobalDefaults(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/global-defaults/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.globalDefaults.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
