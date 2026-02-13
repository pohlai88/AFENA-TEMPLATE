// TanStack Query hooks for Process Period Closing Voucher
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessPeriodClosingVoucher } from '../types/process-period-closing-voucher.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessPeriodClosingVoucherListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Period Closing Voucher records.
 */
export function useProcessPeriodClosingVoucherList(
  params: ProcessPeriodClosingVoucherListParams = {},
  options?: Omit<UseQueryOptions<ProcessPeriodClosingVoucher[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processPeriodClosingVoucher.list(params),
    queryFn: () => apiGet<ProcessPeriodClosingVoucher[]>(`/process-period-closing-voucher${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Period Closing Voucher by ID.
 */
export function useProcessPeriodClosingVoucher(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessPeriodClosingVoucher | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processPeriodClosingVoucher.detail(id ?? ''),
    queryFn: () => apiGet<ProcessPeriodClosingVoucher | null>(`/process-period-closing-voucher/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Period Closing Voucher.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessPeriodClosingVoucher(
  options?: UseMutationOptions<ProcessPeriodClosingVoucher, Error, Partial<ProcessPeriodClosingVoucher>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessPeriodClosingVoucher>) => apiPost<ProcessPeriodClosingVoucher>('/process-period-closing-voucher', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucher.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Period Closing Voucher.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessPeriodClosingVoucher(
  options?: UseMutationOptions<ProcessPeriodClosingVoucher, Error, { id: string; data: Partial<ProcessPeriodClosingVoucher> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessPeriodClosingVoucher> }) =>
      apiPut<ProcessPeriodClosingVoucher>(`/process-period-closing-voucher/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucher.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Period Closing Voucher by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessPeriodClosingVoucher(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-period-closing-voucher/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucher.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Process Period Closing Voucher (set docstatus = 1).
 */
export function useSubmitProcessPeriodClosingVoucher(
  options?: UseMutationOptions<ProcessPeriodClosingVoucher, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProcessPeriodClosingVoucher>(`/process-period-closing-voucher/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucher.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Process Period Closing Voucher (set docstatus = 2).
 */
export function useCancelProcessPeriodClosingVoucher(
  options?: UseMutationOptions<ProcessPeriodClosingVoucher, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProcessPeriodClosingVoucher>(`/process-period-closing-voucher/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucher.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
