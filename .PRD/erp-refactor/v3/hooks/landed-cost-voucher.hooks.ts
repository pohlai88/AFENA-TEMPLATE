// TanStack Query hooks for Landed Cost Voucher
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LandedCostVoucher } from '../types/landed-cost-voucher.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LandedCostVoucherListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Landed Cost Voucher records.
 */
export function useLandedCostVoucherList(
  params: LandedCostVoucherListParams = {},
  options?: Omit<UseQueryOptions<LandedCostVoucher[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.landedCostVoucher.list(params),
    queryFn: () => apiGet<LandedCostVoucher[]>(`/landed-cost-voucher${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Landed Cost Voucher by ID.
 */
export function useLandedCostVoucher(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LandedCostVoucher | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.landedCostVoucher.detail(id ?? ''),
    queryFn: () => apiGet<LandedCostVoucher | null>(`/landed-cost-voucher/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Landed Cost Voucher.
 * Automatically invalidates list queries on success.
 */
export function useCreateLandedCostVoucher(
  options?: UseMutationOptions<LandedCostVoucher, Error, Partial<LandedCostVoucher>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LandedCostVoucher>) => apiPost<LandedCostVoucher>('/landed-cost-voucher', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVoucher.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Landed Cost Voucher.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLandedCostVoucher(
  options?: UseMutationOptions<LandedCostVoucher, Error, { id: string; data: Partial<LandedCostVoucher> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LandedCostVoucher> }) =>
      apiPut<LandedCostVoucher>(`/landed-cost-voucher/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVoucher.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Landed Cost Voucher by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLandedCostVoucher(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/landed-cost-voucher/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVoucher.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Landed Cost Voucher (set docstatus = 1).
 */
export function useSubmitLandedCostVoucher(
  options?: UseMutationOptions<LandedCostVoucher, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<LandedCostVoucher>(`/landed-cost-voucher/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVoucher.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Landed Cost Voucher (set docstatus = 2).
 */
export function useCancelLandedCostVoucher(
  options?: UseMutationOptions<LandedCostVoucher, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<LandedCostVoucher>(`/landed-cost-voucher/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVoucher.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.landedCostVoucher.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
