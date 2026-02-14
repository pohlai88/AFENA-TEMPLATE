// TanStack Query hooks for Subscription Plan
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubscriptionPlan } from '../types/subscription-plan.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubscriptionPlanListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subscription Plan records.
 */
export function useSubscriptionPlanList(
  params: SubscriptionPlanListParams = {},
  options?: Omit<UseQueryOptions<SubscriptionPlan[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subscriptionPlan.list(params),
    queryFn: () => apiGet<SubscriptionPlan[]>(`/subscription-plan${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subscription Plan by ID.
 */
export function useSubscriptionPlan(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubscriptionPlan | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subscriptionPlan.detail(id ?? ''),
    queryFn: () => apiGet<SubscriptionPlan | null>(`/subscription-plan/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subscription Plan.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubscriptionPlan(
  options?: UseMutationOptions<SubscriptionPlan, Error, Partial<SubscriptionPlan>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubscriptionPlan>) => apiPost<SubscriptionPlan>('/subscription-plan', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlan.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subscription Plan.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubscriptionPlan(
  options?: UseMutationOptions<SubscriptionPlan, Error, { id: string; data: Partial<SubscriptionPlan> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubscriptionPlan> }) =>
      apiPut<SubscriptionPlan>(`/subscription-plan/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlan.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlan.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subscription Plan by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubscriptionPlan(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subscription-plan/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionPlan.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
