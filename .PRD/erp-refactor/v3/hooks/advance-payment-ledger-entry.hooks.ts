// TanStack Query hooks for Advance Payment Ledger Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AdvancePaymentLedgerEntry } from '../types/advance-payment-ledger-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AdvancePaymentLedgerEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Advance Payment Ledger Entry records.
 */
export function useAdvancePaymentLedgerEntryList(
  params: AdvancePaymentLedgerEntryListParams = {},
  options?: Omit<UseQueryOptions<AdvancePaymentLedgerEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.advancePaymentLedgerEntry.list(params),
    queryFn: () => apiGet<AdvancePaymentLedgerEntry[]>(`/advance-payment-ledger-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Advance Payment Ledger Entry by ID.
 */
export function useAdvancePaymentLedgerEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AdvancePaymentLedgerEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.advancePaymentLedgerEntry.detail(id ?? ''),
    queryFn: () => apiGet<AdvancePaymentLedgerEntry | null>(`/advance-payment-ledger-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Advance Payment Ledger Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateAdvancePaymentLedgerEntry(
  options?: UseMutationOptions<AdvancePaymentLedgerEntry, Error, Partial<AdvancePaymentLedgerEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AdvancePaymentLedgerEntry>) => apiPost<AdvancePaymentLedgerEntry>('/advance-payment-ledger-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.advancePaymentLedgerEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Advance Payment Ledger Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAdvancePaymentLedgerEntry(
  options?: UseMutationOptions<AdvancePaymentLedgerEntry, Error, { id: string; data: Partial<AdvancePaymentLedgerEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdvancePaymentLedgerEntry> }) =>
      apiPut<AdvancePaymentLedgerEntry>(`/advance-payment-ledger-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.advancePaymentLedgerEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.advancePaymentLedgerEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Advance Payment Ledger Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAdvancePaymentLedgerEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/advance-payment-ledger-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.advancePaymentLedgerEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
