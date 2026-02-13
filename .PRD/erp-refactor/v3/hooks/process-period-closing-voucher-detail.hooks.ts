// TanStack Query hooks for Process Period Closing Voucher Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessPeriodClosingVoucherDetail } from '../types/process-period-closing-voucher-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessPeriodClosingVoucherDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Period Closing Voucher Detail records.
 */
export function useProcessPeriodClosingVoucherDetailList(
  params: ProcessPeriodClosingVoucherDetailListParams = {},
  options?: Omit<UseQueryOptions<ProcessPeriodClosingVoucherDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processPeriodClosingVoucherDetail.list(params),
    queryFn: () => apiGet<ProcessPeriodClosingVoucherDetail[]>(`/process-period-closing-voucher-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Period Closing Voucher Detail by ID.
 */
export function useProcessPeriodClosingVoucherDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessPeriodClosingVoucherDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processPeriodClosingVoucherDetail.detail(id ?? ''),
    queryFn: () => apiGet<ProcessPeriodClosingVoucherDetail | null>(`/process-period-closing-voucher-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Period Closing Voucher Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessPeriodClosingVoucherDetail(
  options?: UseMutationOptions<ProcessPeriodClosingVoucherDetail, Error, Partial<ProcessPeriodClosingVoucherDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessPeriodClosingVoucherDetail>) => apiPost<ProcessPeriodClosingVoucherDetail>('/process-period-closing-voucher-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucherDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Period Closing Voucher Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessPeriodClosingVoucherDetail(
  options?: UseMutationOptions<ProcessPeriodClosingVoucherDetail, Error, { id: string; data: Partial<ProcessPeriodClosingVoucherDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessPeriodClosingVoucherDetail> }) =>
      apiPut<ProcessPeriodClosingVoucherDetail>(`/process-period-closing-voucher-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucherDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucherDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Period Closing Voucher Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessPeriodClosingVoucherDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-period-closing-voucher-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processPeriodClosingVoucherDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
