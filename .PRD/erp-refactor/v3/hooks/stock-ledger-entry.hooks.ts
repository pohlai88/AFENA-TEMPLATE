// TanStack Query hooks for Stock Ledger Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockLedgerEntry } from '../types/stock-ledger-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockLedgerEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Ledger Entry records.
 */
export function useStockLedgerEntryList(
  params: StockLedgerEntryListParams = {},
  options?: Omit<UseQueryOptions<StockLedgerEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockLedgerEntry.list(params),
    queryFn: () => apiGet<StockLedgerEntry[]>(`/stock-ledger-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Ledger Entry by ID.
 */
export function useStockLedgerEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockLedgerEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockLedgerEntry.detail(id ?? ''),
    queryFn: () => apiGet<StockLedgerEntry | null>(`/stock-ledger-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Ledger Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockLedgerEntry(
  options?: UseMutationOptions<StockLedgerEntry, Error, Partial<StockLedgerEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockLedgerEntry>) => apiPost<StockLedgerEntry>('/stock-ledger-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockLedgerEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Ledger Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockLedgerEntry(
  options?: UseMutationOptions<StockLedgerEntry, Error, { id: string; data: Partial<StockLedgerEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockLedgerEntry> }) =>
      apiPut<StockLedgerEntry>(`/stock-ledger-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockLedgerEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockLedgerEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Ledger Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockLedgerEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-ledger-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockLedgerEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
