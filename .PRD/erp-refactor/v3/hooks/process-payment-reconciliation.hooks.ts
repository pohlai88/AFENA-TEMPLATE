// TanStack Query hooks for Process Payment Reconciliation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessPaymentReconciliation } from '../types/process-payment-reconciliation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessPaymentReconciliationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Payment Reconciliation records.
 */
export function useProcessPaymentReconciliationList(
  params: ProcessPaymentReconciliationListParams = {},
  options?: Omit<UseQueryOptions<ProcessPaymentReconciliation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processPaymentReconciliation.list(params),
    queryFn: () => apiGet<ProcessPaymentReconciliation[]>(`/process-payment-reconciliation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Payment Reconciliation by ID.
 */
export function useProcessPaymentReconciliation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessPaymentReconciliation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processPaymentReconciliation.detail(id ?? ''),
    queryFn: () => apiGet<ProcessPaymentReconciliation | null>(`/process-payment-reconciliation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Payment Reconciliation.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessPaymentReconciliation(
  options?: UseMutationOptions<ProcessPaymentReconciliation, Error, Partial<ProcessPaymentReconciliation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessPaymentReconciliation>) => apiPost<ProcessPaymentReconciliation>('/process-payment-reconciliation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Payment Reconciliation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessPaymentReconciliation(
  options?: UseMutationOptions<ProcessPaymentReconciliation, Error, { id: string; data: Partial<ProcessPaymentReconciliation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessPaymentReconciliation> }) =>
      apiPut<ProcessPaymentReconciliation>(`/process-payment-reconciliation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Payment Reconciliation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessPaymentReconciliation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-payment-reconciliation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Process Payment Reconciliation (set docstatus = 1).
 */
export function useSubmitProcessPaymentReconciliation(
  options?: UseMutationOptions<ProcessPaymentReconciliation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProcessPaymentReconciliation>(`/process-payment-reconciliation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Process Payment Reconciliation (set docstatus = 2).
 */
export function useCancelProcessPaymentReconciliation(
  options?: UseMutationOptions<ProcessPaymentReconciliation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProcessPaymentReconciliation>(`/process-payment-reconciliation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
