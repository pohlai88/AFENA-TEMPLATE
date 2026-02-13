// TanStack Query hooks for Period Closing Voucher
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PeriodClosingVoucher } from '../types/period-closing-voucher.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PeriodClosingVoucherListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Period Closing Voucher records.
 */
export function usePeriodClosingVoucherList(
  params: PeriodClosingVoucherListParams = {},
  options?: Omit<UseQueryOptions<PeriodClosingVoucher[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.periodClosingVoucher.list(params),
    queryFn: () => apiGet<PeriodClosingVoucher[]>(`/period-closing-voucher${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Period Closing Voucher by ID.
 */
export function usePeriodClosingVoucher(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PeriodClosingVoucher | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.periodClosingVoucher.detail(id ?? ''),
    queryFn: () => apiGet<PeriodClosingVoucher | null>(`/period-closing-voucher/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Period Closing Voucher.
 * Automatically invalidates list queries on success.
 */
export function useCreatePeriodClosingVoucher(
  options?: UseMutationOptions<PeriodClosingVoucher, Error, Partial<PeriodClosingVoucher>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PeriodClosingVoucher>) => apiPost<PeriodClosingVoucher>('/period-closing-voucher', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.periodClosingVoucher.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Period Closing Voucher.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePeriodClosingVoucher(
  options?: UseMutationOptions<PeriodClosingVoucher, Error, { id: string; data: Partial<PeriodClosingVoucher> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PeriodClosingVoucher> }) =>
      apiPut<PeriodClosingVoucher>(`/period-closing-voucher/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.periodClosingVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.periodClosingVoucher.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Period Closing Voucher by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePeriodClosingVoucher(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/period-closing-voucher/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.periodClosingVoucher.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Period Closing Voucher (set docstatus = 1).
 */
export function useSubmitPeriodClosingVoucher(
  options?: UseMutationOptions<PeriodClosingVoucher, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PeriodClosingVoucher>(`/period-closing-voucher/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.periodClosingVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.periodClosingVoucher.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Period Closing Voucher (set docstatus = 2).
 */
export function useCancelPeriodClosingVoucher(
  options?: UseMutationOptions<PeriodClosingVoucher, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PeriodClosingVoucher>(`/period-closing-voucher/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.periodClosingVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.periodClosingVoucher.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
