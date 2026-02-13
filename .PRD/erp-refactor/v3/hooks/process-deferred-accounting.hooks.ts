// TanStack Query hooks for Process Deferred Accounting
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessDeferredAccounting } from '../types/process-deferred-accounting.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessDeferredAccountingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Deferred Accounting records.
 */
export function useProcessDeferredAccountingList(
  params: ProcessDeferredAccountingListParams = {},
  options?: Omit<UseQueryOptions<ProcessDeferredAccounting[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processDeferredAccounting.list(params),
    queryFn: () => apiGet<ProcessDeferredAccounting[]>(`/process-deferred-accounting${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Deferred Accounting by ID.
 */
export function useProcessDeferredAccounting(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessDeferredAccounting | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processDeferredAccounting.detail(id ?? ''),
    queryFn: () => apiGet<ProcessDeferredAccounting | null>(`/process-deferred-accounting/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Deferred Accounting.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessDeferredAccounting(
  options?: UseMutationOptions<ProcessDeferredAccounting, Error, Partial<ProcessDeferredAccounting>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessDeferredAccounting>) => apiPost<ProcessDeferredAccounting>('/process-deferred-accounting', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processDeferredAccounting.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Deferred Accounting.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessDeferredAccounting(
  options?: UseMutationOptions<ProcessDeferredAccounting, Error, { id: string; data: Partial<ProcessDeferredAccounting> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessDeferredAccounting> }) =>
      apiPut<ProcessDeferredAccounting>(`/process-deferred-accounting/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processDeferredAccounting.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processDeferredAccounting.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Deferred Accounting by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessDeferredAccounting(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-deferred-accounting/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processDeferredAccounting.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Process Deferred Accounting (set docstatus = 1).
 */
export function useSubmitProcessDeferredAccounting(
  options?: UseMutationOptions<ProcessDeferredAccounting, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProcessDeferredAccounting>(`/process-deferred-accounting/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processDeferredAccounting.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processDeferredAccounting.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Process Deferred Accounting (set docstatus = 2).
 */
export function useCancelProcessDeferredAccounting(
  options?: UseMutationOptions<ProcessDeferredAccounting, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProcessDeferredAccounting>(`/process-deferred-accounting/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processDeferredAccounting.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processDeferredAccounting.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
