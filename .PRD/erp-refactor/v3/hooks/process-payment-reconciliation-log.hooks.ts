// TanStack Query hooks for Process Payment Reconciliation Log
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessPaymentReconciliationLog } from '../types/process-payment-reconciliation-log.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessPaymentReconciliationLogListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Payment Reconciliation Log records.
 */
export function useProcessPaymentReconciliationLogList(
  params: ProcessPaymentReconciliationLogListParams = {},
  options?: Omit<UseQueryOptions<ProcessPaymentReconciliationLog[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processPaymentReconciliationLog.list(params),
    queryFn: () => apiGet<ProcessPaymentReconciliationLog[]>(`/process-payment-reconciliation-log${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Payment Reconciliation Log by ID.
 */
export function useProcessPaymentReconciliationLog(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessPaymentReconciliationLog | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processPaymentReconciliationLog.detail(id ?? ''),
    queryFn: () => apiGet<ProcessPaymentReconciliationLog | null>(`/process-payment-reconciliation-log/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Payment Reconciliation Log.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessPaymentReconciliationLog(
  options?: UseMutationOptions<ProcessPaymentReconciliationLog, Error, Partial<ProcessPaymentReconciliationLog>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessPaymentReconciliationLog>) => apiPost<ProcessPaymentReconciliationLog>('/process-payment-reconciliation-log', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliationLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Payment Reconciliation Log.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessPaymentReconciliationLog(
  options?: UseMutationOptions<ProcessPaymentReconciliationLog, Error, { id: string; data: Partial<ProcessPaymentReconciliationLog> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessPaymentReconciliationLog> }) =>
      apiPut<ProcessPaymentReconciliationLog>(`/process-payment-reconciliation-log/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliationLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliationLog.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Payment Reconciliation Log by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessPaymentReconciliationLog(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-payment-reconciliation-log/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPaymentReconciliationLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
