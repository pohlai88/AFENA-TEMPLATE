// TanStack Query hooks for Stock Closing Balance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockClosingBalance } from '../types/stock-closing-balance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockClosingBalanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Closing Balance records.
 */
export function useStockClosingBalanceList(
  params: StockClosingBalanceListParams = {},
  options?: Omit<UseQueryOptions<StockClosingBalance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockClosingBalance.list(params),
    queryFn: () => apiGet<StockClosingBalance[]>(`/stock-closing-balance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Closing Balance by ID.
 */
export function useStockClosingBalance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockClosingBalance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockClosingBalance.detail(id ?? ''),
    queryFn: () => apiGet<StockClosingBalance | null>(`/stock-closing-balance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Closing Balance.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockClosingBalance(
  options?: UseMutationOptions<StockClosingBalance, Error, Partial<StockClosingBalance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockClosingBalance>) => apiPost<StockClosingBalance>('/stock-closing-balance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingBalance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Closing Balance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockClosingBalance(
  options?: UseMutationOptions<StockClosingBalance, Error, { id: string; data: Partial<StockClosingBalance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockClosingBalance> }) =>
      apiPut<StockClosingBalance>(`/stock-closing-balance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingBalance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingBalance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Closing Balance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockClosingBalance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-closing-balance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingBalance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
