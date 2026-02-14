// TanStack Query hooks for Subscription Plan Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubscriptionPlanDetail } from '../types/subscription-plan-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubscriptionPlanDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subscription Plan Detail records.
 */
export function useSubscriptionPlanDetailList(
  params: SubscriptionPlanDetailListParams = {},
  options?: Omit<UseQueryOptions<SubscriptionPlanDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subscriptionPlanDetail.list(params),
    queryFn: () => apiGet<SubscriptionPlanDetail[]>(`/subscription-plan-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subscription Plan Detail by ID.
 */
export function useSubscriptionPlanDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubscriptionPlanDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subscriptionPlanDetail.detail(id ?? ''),
    queryFn: () => apiGet<SubscriptionPlanDetail | null>(`/subscription-plan-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subscription Plan Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubscriptionPlanDetail(
  options?: UseMutationOptions<SubscriptionPlanDetail, Error, Partial<SubscriptionPlanDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubscriptionPlanDetail>) => apiPost<SubscriptionPlanDetail>('/subscription-plan-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlanDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subscription Plan Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubscriptionPlanDetail(
  options?: UseMutationOptions<SubscriptionPlanDetail, Error, { id: string; data: Partial<SubscriptionPlanDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubscriptionPlanDetail> }) =>
      apiPut<SubscriptionPlanDetail>(`/subscription-plan-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlanDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlanDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subscription Plan Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubscriptionPlanDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subscription-plan-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlanDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
