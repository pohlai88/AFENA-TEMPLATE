// TanStack Query hooks for Stock Reconciliation Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockReconciliationItem } from '../types/stock-reconciliation-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockReconciliationItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Reconciliation Item records.
 */
export function useStockReconciliationItemList(
  params: StockReconciliationItemListParams = {},
  options?: Omit<UseQueryOptions<StockReconciliationItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockReconciliationItem.list(params),
    queryFn: () => apiGet<StockReconciliationItem[]>(`/stock-reconciliation-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Reconciliation Item by ID.
 */
export function useStockReconciliationItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockReconciliationItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockReconciliationItem.detail(id ?? ''),
    queryFn: () => apiGet<StockReconciliationItem | null>(`/stock-reconciliation-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Reconciliation Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockReconciliationItem(
  options?: UseMutationOptions<StockReconciliationItem, Error, Partial<StockReconciliationItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockReconciliationItem>) => apiPost<StockReconciliationItem>('/stock-reconciliation-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliationItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Reconciliation Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockReconciliationItem(
  options?: UseMutationOptions<StockReconciliationItem, Error, { id: string; data: Partial<StockReconciliationItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockReconciliationItem> }) =>
      apiPut<StockReconciliationItem>(`/stock-reconciliation-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliationItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliationItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Reconciliation Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockReconciliationItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-reconciliation-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliationItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
