// TanStack Query hooks for Stock Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockEntry } from '../types/stock-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Entry records.
 */
export function useStockEntryList(
  params: StockEntryListParams = {},
  options?: Omit<UseQueryOptions<StockEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockEntry.list(params),
    queryFn: () => apiGet<StockEntry[]>(`/stock-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Entry by ID.
 */
export function useStockEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockEntry.detail(id ?? ''),
    queryFn: () => apiGet<StockEntry | null>(`/stock-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockEntry(
  options?: UseMutationOptions<StockEntry, Error, Partial<StockEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockEntry>) => apiPost<StockEntry>('/stock-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockEntry(
  options?: UseMutationOptions<StockEntry, Error, { id: string; data: Partial<StockEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockEntry> }) =>
      apiPut<StockEntry>(`/stock-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Stock Entry (set docstatus = 1).
 */
export function useSubmitStockEntry(
  options?: UseMutationOptions<StockEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<StockEntry>(`/stock-entry/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Stock Entry (set docstatus = 2).
 */
export function useCancelStockEntry(
  options?: UseMutationOptions<StockEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<StockEntry>(`/stock-entry/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
