// TanStack Query hooks for Payment Order Reference
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentOrderReference } from '../types/payment-order-reference.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentOrderReferenceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Order Reference records.
 */
export function usePaymentOrderReferenceList(
  params: PaymentOrderReferenceListParams = {},
  options?: Omit<UseQueryOptions<PaymentOrderReference[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentOrderReference.list(params),
    queryFn: () => apiGet<PaymentOrderReference[]>(`/payment-order-reference${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Order Reference by ID.
 */
export function usePaymentOrderReference(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentOrderReference | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentOrderReference.detail(id ?? ''),
    queryFn: () => apiGet<PaymentOrderReference | null>(`/payment-order-reference/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Order Reference.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentOrderReference(
  options?: UseMutationOptions<PaymentOrderReference, Error, Partial<PaymentOrderReference>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentOrderReference>) => apiPost<PaymentOrderReference>('/payment-order-reference', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrderReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Order Reference.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentOrderReference(
  options?: UseMutationOptions<PaymentOrderReference, Error, { id: string; data: Partial<PaymentOrderReference> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentOrderReference> }) =>
      apiPut<PaymentOrderReference>(`/payment-order-reference/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrderReference.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrderReference.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Order Reference by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentOrderReference(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-order-reference/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrderReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
