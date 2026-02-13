// TanStack Query hooks for Payment Entry Deduction
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentEntryDeduction } from '../types/payment-entry-deduction.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentEntryDeductionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Entry Deduction records.
 */
export function usePaymentEntryDeductionList(
  params: PaymentEntryDeductionListParams = {},
  options?: Omit<UseQueryOptions<PaymentEntryDeduction[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentEntryDeduction.list(params),
    queryFn: () => apiGet<PaymentEntryDeduction[]>(`/payment-entry-deduction${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Entry Deduction by ID.
 */
export function usePaymentEntryDeduction(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentEntryDeduction | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentEntryDeduction.detail(id ?? ''),
    queryFn: () => apiGet<PaymentEntryDeduction | null>(`/payment-entry-deduction/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Entry Deduction.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentEntryDeduction(
  options?: UseMutationOptions<PaymentEntryDeduction, Error, Partial<PaymentEntryDeduction>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentEntryDeduction>) => apiPost<PaymentEntryDeduction>('/payment-entry-deduction', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntryDeduction.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Entry Deduction.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentEntryDeduction(
  options?: UseMutationOptions<PaymentEntryDeduction, Error, { id: string; data: Partial<PaymentEntryDeduction> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentEntryDeduction> }) =>
      apiPut<PaymentEntryDeduction>(`/payment-entry-deduction/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntryDeduction.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntryDeduction.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Entry Deduction by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentEntryDeduction(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-entry-deduction/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentEntryDeduction.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
