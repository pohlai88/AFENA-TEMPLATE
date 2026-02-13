// TanStack Query hooks for Share Balance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShareBalance } from '../types/share-balance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShareBalanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Share Balance records.
 */
export function useShareBalanceList(
  params: ShareBalanceListParams = {},
  options?: Omit<UseQueryOptions<ShareBalance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shareBalance.list(params),
    queryFn: () => apiGet<ShareBalance[]>(`/share-balance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Share Balance by ID.
 */
export function useShareBalance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShareBalance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shareBalance.detail(id ?? ''),
    queryFn: () => apiGet<ShareBalance | null>(`/share-balance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Share Balance.
 * Automatically invalidates list queries on success.
 */
export function useCreateShareBalance(
  options?: UseMutationOptions<ShareBalance, Error, Partial<ShareBalance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShareBalance>) => apiPost<ShareBalance>('/share-balance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareBalance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Share Balance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShareBalance(
  options?: UseMutationOptions<ShareBalance, Error, { id: string; data: Partial<ShareBalance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShareBalance> }) =>
      apiPut<ShareBalance>(`/share-balance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareBalance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shareBalance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Share Balance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShareBalance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/share-balance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareBalance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
