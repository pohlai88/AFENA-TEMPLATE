// TanStack Query hooks for Coupon Code
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CouponCode } from '../types/coupon-code.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CouponCodeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Coupon Code records.
 */
export function useCouponCodeList(
  params: CouponCodeListParams = {},
  options?: Omit<UseQueryOptions<CouponCode[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.couponCode.list(params),
    queryFn: () => apiGet<CouponCode[]>(`/coupon-code${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Coupon Code by ID.
 */
export function useCouponCode(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CouponCode | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.couponCode.detail(id ?? ''),
    queryFn: () => apiGet<CouponCode | null>(`/coupon-code/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Coupon Code.
 * Automatically invalidates list queries on success.
 */
export function useCreateCouponCode(
  options?: UseMutationOptions<CouponCode, Error, Partial<CouponCode>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CouponCode>) => apiPost<CouponCode>('/coupon-code', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.couponCode.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Coupon Code.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCouponCode(
  options?: UseMutationOptions<CouponCode, Error, { id: string; data: Partial<CouponCode> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CouponCode> }) =>
      apiPut<CouponCode>(`/coupon-code/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.couponCode.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.couponCode.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Coupon Code by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCouponCode(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/coupon-code/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.couponCode.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
