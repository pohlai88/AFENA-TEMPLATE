// TanStack Query hooks for Payment Entry Reference
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentEntryReference } from '../types/payment-entry-reference.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentEntryReferenceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Entry Reference records.
 */
export function usePaymentEntryReferenceList(
  params: PaymentEntryReferenceListParams = {},
  options?: Omit<UseQueryOptions<PaymentEntryReference[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentEntryReference.list(params),
    queryFn: () => apiGet<PaymentEntryReference[]>(`/payment-entry-reference${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Entry Reference by ID.
 */
export function usePaymentEntryReference(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentEntryReference | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentEntryReference.detail(id ?? ''),
    queryFn: () => apiGet<PaymentEntryReference | null>(`/payment-entry-reference/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Entry Reference.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentEntryReference(
  options?: UseMutationOptions<PaymentEntryReference, Error, Partial<PaymentEntryReference>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentEntryReference>) => apiPost<PaymentEntryReference>('/payment-entry-reference', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntryReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Entry Reference.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentEntryReference(
  options?: UseMutationOptions<PaymentEntryReference, Error, { id: string; data: Partial<PaymentEntryReference> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentEntryReference> }) =>
      apiPut<PaymentEntryReference>(`/payment-entry-reference/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntryReference.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntryReference.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Entry Reference by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentEntryReference(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-entry-reference/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntryReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
