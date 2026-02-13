// TanStack Query hooks for Stock Closing Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockClosingEntry } from '../types/stock-closing-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockClosingEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Closing Entry records.
 */
export function useStockClosingEntryList(
  params: StockClosingEntryListParams = {},
  options?: Omit<UseQueryOptions<StockClosingEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockClosingEntry.list(params),
    queryFn: () => apiGet<StockClosingEntry[]>(`/stock-closing-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Closing Entry by ID.
 */
export function useStockClosingEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockClosingEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockClosingEntry.detail(id ?? ''),
    queryFn: () => apiGet<StockClosingEntry | null>(`/stock-closing-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Closing Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockClosingEntry(
  options?: UseMutationOptions<StockClosingEntry, Error, Partial<StockClosingEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockClosingEntry>) => apiPost<StockClosingEntry>('/stock-closing-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Closing Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockClosingEntry(
  options?: UseMutationOptions<StockClosingEntry, Error, { id: string; data: Partial<StockClosingEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockClosingEntry> }) =>
      apiPut<StockClosingEntry>(`/stock-closing-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Closing Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockClosingEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-closing-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Stock Closing Entry (set docstatus = 1).
 */
export function useSubmitStockClosingEntry(
  options?: UseMutationOptions<StockClosingEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<StockClosingEntry>(`/stock-closing-entry/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Stock Closing Entry (set docstatus = 2).
 */
export function useCancelStockClosingEntry(
  options?: UseMutationOptions<StockClosingEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<StockClosingEntry>(`/stock-closing-entry/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockClosingEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
