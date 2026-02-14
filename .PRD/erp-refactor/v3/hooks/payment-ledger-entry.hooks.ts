// TanStack Query hooks for Payment Ledger Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentLedgerEntry } from '../types/payment-ledger-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentLedgerEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Ledger Entry records.
 */
export function usePaymentLedgerEntryList(
  params: PaymentLedgerEntryListParams = {},
  options?: Omit<UseQueryOptions<PaymentLedgerEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentLedgerEntry.list(params),
    queryFn: () => apiGet<PaymentLedgerEntry[]>(`/payment-ledger-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Ledger Entry by ID.
 */
export function usePaymentLedgerEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentLedgerEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentLedgerEntry.detail(id ?? ''),
    queryFn: () => apiGet<PaymentLedgerEntry | null>(`/payment-ledger-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Ledger Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentLedgerEntry(
  options?: UseMutationOptions<PaymentLedgerEntry, Error, Partial<PaymentLedgerEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentLedgerEntry>) => apiPost<PaymentLedgerEntry>('/payment-ledger-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentLedgerEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Ledger Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentLedgerEntry(
  options?: UseMutationOptions<PaymentLedgerEntry, Error, { id: string; data: Partial<PaymentLedgerEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentLedgerEntry> }) =>
      apiPut<PaymentLedgerEntry>(`/payment-ledger-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentLedgerEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentLedgerEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Ledger Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentLedgerEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-ledger-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentLedgerEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
