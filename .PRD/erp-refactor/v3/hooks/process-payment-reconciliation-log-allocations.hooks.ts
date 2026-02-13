// TanStack Query hooks for Process Payment Reconciliation Log Allocations
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessPaymentReconciliationLogAllocations } from '../types/process-payment-reconciliation-log-allocations.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessPaymentReconciliationLogAllocationsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Payment Reconciliation Log Allocations records.
 */
export function useProcessPaymentReconciliationLogAllocationsList(
  params: ProcessPaymentReconciliationLogAllocationsListParams = {},
  options?: Omit<UseQueryOptions<ProcessPaymentReconciliationLogAllocations[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processPaymentReconciliationLogAllocations.list(params),
    queryFn: () => apiGet<ProcessPaymentReconciliationLogAllocations[]>(`/process-payment-reconciliation-log-allocations${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Payment Reconciliation Log Allocations by ID.
 */
export function useProcessPaymentReconciliationLogAllocations(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessPaymentReconciliationLogAllocations | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processPaymentReconciliationLogAllocations.detail(id ?? ''),
    queryFn: () => apiGet<ProcessPaymentReconciliationLogAllocations | null>(`/process-payment-reconciliation-log-allocations/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Payment Reconciliation Log Allocations.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessPaymentReconciliationLogAllocations(
  options?: UseMutationOptions<ProcessPaymentReconciliationLogAllocations, Error, Partial<ProcessPaymentReconciliationLogAllocations>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessPaymentReconciliationLogAllocations>) => apiPost<ProcessPaymentReconciliationLogAllocations>('/process-payment-reconciliation-log-allocations', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliationLogAllocations.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Payment Reconciliation Log Allocations.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessPaymentReconciliationLogAllocations(
  options?: UseMutationOptions<ProcessPaymentReconciliationLogAllocations, Error, { id: string; data: Partial<ProcessPaymentReconciliationLogAllocations> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessPaymentReconciliationLogAllocations> }) =>
      apiPut<ProcessPaymentReconciliationLogAllocations>(`/process-payment-reconciliation-log-allocations/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliationLogAllocations.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliationLogAllocations.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Payment Reconciliation Log Allocations by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessPaymentReconciliationLogAllocations(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-payment-reconciliation-log-allocations/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliationLogAllocations.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
