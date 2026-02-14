// TanStack Query hooks for Payment Term
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentTerm } from '../types/payment-term.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentTermListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Term records.
 */
export function usePaymentTermList(
  params: PaymentTermListParams = {},
  options?: Omit<UseQueryOptions<PaymentTerm[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentTerm.list(params),
    queryFn: () => apiGet<PaymentTerm[]>(`/payment-term${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Term by ID.
 */
export function usePaymentTerm(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentTerm | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentTerm.detail(id ?? ''),
    queryFn: () => apiGet<PaymentTerm | null>(`/payment-term/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Term.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentTerm(
  options?: UseMutationOptions<PaymentTerm, Error, Partial<PaymentTerm>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentTerm>) => apiPost<PaymentTerm>('/payment-term', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTerm.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Term.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentTerm(
  options?: UseMutationOptions<PaymentTerm, Error, { id: string; data: Partial<PaymentTerm> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentTerm> }) =>
      apiPut<PaymentTerm>(`/payment-term/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTerm.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTerm.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Term by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentTerm(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-term/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTerm.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
