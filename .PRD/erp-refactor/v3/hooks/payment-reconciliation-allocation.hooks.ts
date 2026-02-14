// TanStack Query hooks for Payment Reconciliation Allocation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentReconciliationAllocation } from '../types/payment-reconciliation-allocation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentReconciliationAllocationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Reconciliation Allocation records.
 */
export function usePaymentReconciliationAllocationList(
  params: PaymentReconciliationAllocationListParams = {},
  options?: Omit<UseQueryOptions<PaymentReconciliationAllocation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentReconciliationAllocation.list(params),
    queryFn: () => apiGet<PaymentReconciliationAllocation[]>(`/payment-reconciliation-allocation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Reconciliation Allocation by ID.
 */
export function usePaymentReconciliationAllocation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentReconciliationAllocation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentReconciliationAllocation.detail(id ?? ''),
    queryFn: () => apiGet<PaymentReconciliationAllocation | null>(`/payment-reconciliation-allocation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Reconciliation Allocation.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentReconciliationAllocation(
  options?: UseMutationOptions<PaymentReconciliationAllocation, Error, Partial<PaymentReconciliationAllocation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentReconciliationAllocation>) => apiPost<PaymentReconciliationAllocation>('/payment-reconciliation-allocation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationAllocation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Reconciliation Allocation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentReconciliationAllocation(
  options?: UseMutationOptions<PaymentReconciliationAllocation, Error, { id: string; data: Partial<PaymentReconciliationAllocation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentReconciliationAllocation> }) =>
      apiPut<PaymentReconciliationAllocation>(`/payment-reconciliation-allocation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationAllocation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationAllocation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Reconciliation Allocation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentReconciliationAllocation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-reconciliation-allocation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationAllocation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
