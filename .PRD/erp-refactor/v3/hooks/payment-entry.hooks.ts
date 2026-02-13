// TanStack Query hooks for Payment Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentEntry } from '../types/payment-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Entry records.
 */
export function usePaymentEntryList(
  params: PaymentEntryListParams = {},
  options?: Omit<UseQueryOptions<PaymentEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentEntry.list(params),
    queryFn: () => apiGet<PaymentEntry[]>(`/payment-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Entry by ID.
 */
export function usePaymentEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentEntry.detail(id ?? ''),
    queryFn: () => apiGet<PaymentEntry | null>(`/payment-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentEntry(
  options?: UseMutationOptions<PaymentEntry, Error, Partial<PaymentEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentEntry>) => apiPost<PaymentEntry>('/payment-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentEntry(
  options?: UseMutationOptions<PaymentEntry, Error, { id: string; data: Partial<PaymentEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentEntry> }) =>
      apiPut<PaymentEntry>(`/payment-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Payment Entry (set docstatus = 1).
 */
export function useSubmitPaymentEntry(
  options?: UseMutationOptions<PaymentEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PaymentEntry>(`/payment-entry/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Payment Entry (set docstatus = 2).
 */
export function useCancelPaymentEntry(
  options?: UseMutationOptions<PaymentEntry, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PaymentEntry>(`/payment-entry/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntry.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
