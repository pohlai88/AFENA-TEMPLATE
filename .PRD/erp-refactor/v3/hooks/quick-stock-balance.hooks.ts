// TanStack Query hooks for Quick Stock Balance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QuickStockBalance } from '../types/quick-stock-balance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QuickStockBalanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quick Stock Balance records.
 */
export function useQuickStockBalanceList(
  params: QuickStockBalanceListParams = {},
  options?: Omit<UseQueryOptions<QuickStockBalance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.quickStockBalance.list(params),
    queryFn: () => apiGet<QuickStockBalance[]>(`/quick-stock-balance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quick Stock Balance by ID.
 */
export function useQuickStockBalance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QuickStockBalance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.quickStockBalance.detail(id ?? ''),
    queryFn: () => apiGet<QuickStockBalance | null>(`/quick-stock-balance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quick Stock Balance.
 * Automatically invalidates list queries on success.
 */
export function useCreateQuickStockBalance(
  options?: UseMutationOptions<QuickStockBalance, Error, Partial<QuickStockBalance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QuickStockBalance>) => apiPost<QuickStockBalance>('/quick-stock-balance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quickStockBalance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quick Stock Balance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQuickStockBalance(
  options?: UseMutationOptions<QuickStockBalance, Error, { id: string; data: Partial<QuickStockBalance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuickStockBalance> }) =>
      apiPut<QuickStockBalance>(`/quick-stock-balance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quickStockBalance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quickStockBalance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quick Stock Balance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQuickStockBalance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quick-stock-balance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quickStockBalance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
