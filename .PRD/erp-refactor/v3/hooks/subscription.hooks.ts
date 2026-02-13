// TanStack Query hooks for Subscription
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Subscription } from '../types/subscription.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubscriptionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subscription records.
 */
export function useSubscriptionList(
  params: SubscriptionListParams = {},
  options?: Omit<UseQueryOptions<Subscription[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subscription.list(params),
    queryFn: () => apiGet<Subscription[]>(`/subscription${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subscription by ID.
 */
export function useSubscription(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Subscription | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subscription.detail(id ?? ''),
    queryFn: () => apiGet<Subscription | null>(`/subscription/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subscription.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubscription(
  options?: UseMutationOptions<Subscription, Error, Partial<Subscription>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Subscription>) => apiPost<Subscription>('/subscription', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subscription.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubscription(
  options?: UseMutationOptions<Subscription, Error, { id: string; data: Partial<Subscription> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Subscription> }) =>
      apiPut<Subscription>(`/subscription/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subscription by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubscription(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subscription/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
