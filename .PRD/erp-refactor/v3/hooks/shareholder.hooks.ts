// TanStack Query hooks for Shareholder
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Shareholder } from '../types/shareholder.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShareholderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Shareholder records.
 */
export function useShareholderList(
  params: ShareholderListParams = {},
  options?: Omit<UseQueryOptions<Shareholder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shareholder.list(params),
    queryFn: () => apiGet<Shareholder[]>(`/shareholder${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Shareholder by ID.
 */
export function useShareholder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Shareholder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shareholder.detail(id ?? ''),
    queryFn: () => apiGet<Shareholder | null>(`/shareholder/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Shareholder.
 * Automatically invalidates list queries on success.
 */
export function useCreateShareholder(
  options?: UseMutationOptions<Shareholder, Error, Partial<Shareholder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Shareholder>) => apiPost<Shareholder>('/shareholder', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareholder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Shareholder.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShareholder(
  options?: UseMutationOptions<Shareholder, Error, { id: string; data: Partial<Shareholder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shareholder> }) =>
      apiPut<Shareholder>(`/shareholder/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareholder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shareholder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Shareholder by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShareholder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/shareholder/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareholder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
