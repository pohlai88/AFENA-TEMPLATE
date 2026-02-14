// TanStack Query hooks for Stock Reconciliation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockReconciliation } from '../types/stock-reconciliation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockReconciliationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Reconciliation records.
 */
export function useStockReconciliationList(
  params: StockReconciliationListParams = {},
  options?: Omit<UseQueryOptions<StockReconciliation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockReconciliation.list(params),
    queryFn: () => apiGet<StockReconciliation[]>(`/stock-reconciliation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Reconciliation by ID.
 */
export function useStockReconciliation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockReconciliation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockReconciliation.detail(id ?? ''),
    queryFn: () => apiGet<StockReconciliation | null>(`/stock-reconciliation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Reconciliation.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockReconciliation(
  options?: UseMutationOptions<StockReconciliation, Error, Partial<StockReconciliation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockReconciliation>) => apiPost<StockReconciliation>('/stock-reconciliation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Reconciliation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockReconciliation(
  options?: UseMutationOptions<StockReconciliation, Error, { id: string; data: Partial<StockReconciliation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockReconciliation> }) =>
      apiPut<StockReconciliation>(`/stock-reconciliation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Reconciliation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockReconciliation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-reconciliation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Stock Reconciliation (set docstatus = 1).
 */
export function useSubmitStockReconciliation(
  options?: UseMutationOptions<StockReconciliation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<StockReconciliation>(`/stock-reconciliation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Stock Reconciliation (set docstatus = 2).
 */
export function useCancelStockReconciliation(
  options?: UseMutationOptions<StockReconciliation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<StockReconciliation>(`/stock-reconciliation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReconciliation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
