// TanStack Query hooks for Stock Reservation Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockReservationEntry } from '../types/stock-reservation-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockReservationEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Reservation Entry records.
 */
export function useStockReservationEntryList(
  params: StockReservationEntryListParams = {},
  options?: Omit<UseQueryOptions<StockReservationEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockReservationEntry.list(params),
    queryFn: () => apiGet<StockReservationEntry[]>(`/stock-reservation-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Reservation Entry by ID.
 */
export function useStockReservationEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockReservationEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockReservationEntry.detail(id ?? ''),
    queryFn: () => apiGet<StockReservationEntry | null>(`/stock-reservation-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Reservation Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockReservationEntry(
  options?: UseMutationOptions<StockReservationEntry, Error, Partial<StockReservationEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockReservationEntry>) => apiPost<StockReservationEntry>('/stock-reservation-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReservationEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Reservation Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockReservationEntry(
  options?: UseMutationOptions<StockReservationEntry, Error, { id: string; data: Partial<StockReservationEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockReservationEntry> }) =>
      apiPut<StockReservationEntry>(`/stock-reservation-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReservationEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReservationEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Reservation Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockReservationEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-reservation-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReservationEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Stock Reservation Entry (set docstatus = 1).
 */
export function useSubmitStockReservationEntry(
  options?: UseMutationOptions<StockReservationEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<StockReservationEntry>(`/stock-reservation-entry/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReservationEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReservationEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Stock Reservation Entry (set docstatus = 2).
 */
export function useCancelStockReservationEntry(
  options?: UseMutationOptions<StockReservationEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<StockReservationEntry>(`/stock-reservation-entry/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReservationEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockReservationEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
