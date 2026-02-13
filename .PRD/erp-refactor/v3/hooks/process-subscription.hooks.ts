// TanStack Query hooks for Process Subscription
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessSubscription } from '../types/process-subscription.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessSubscriptionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Subscription records.
 */
export function useProcessSubscriptionList(
  params: ProcessSubscriptionListParams = {},
  options?: Omit<UseQueryOptions<ProcessSubscription[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processSubscription.list(params),
    queryFn: () => apiGet<ProcessSubscription[]>(`/process-subscription${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Subscription by ID.
 */
export function useProcessSubscription(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessSubscription | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processSubscription.detail(id ?? ''),
    queryFn: () => apiGet<ProcessSubscription | null>(`/process-subscription/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Subscription.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessSubscription(
  options?: UseMutationOptions<ProcessSubscription, Error, Partial<ProcessSubscription>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessSubscription>) => apiPost<ProcessSubscription>('/process-subscription', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processSubscription.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Subscription.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessSubscription(
  options?: UseMutationOptions<ProcessSubscription, Error, { id: string; data: Partial<ProcessSubscription> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessSubscription> }) =>
      apiPut<ProcessSubscription>(`/process-subscription/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processSubscription.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processSubscription.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Subscription by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessSubscription(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-subscription/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processSubscription.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Process Subscription (set docstatus = 1).
 */
export function useSubmitProcessSubscription(
  options?: UseMutationOptions<ProcessSubscription, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProcessSubscription>(`/process-subscription/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processSubscription.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processSubscription.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Process Subscription (set docstatus = 2).
 */
export function useCancelProcessSubscription(
  options?: UseMutationOptions<ProcessSubscription, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProcessSubscription>(`/process-subscription/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processSubscription.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processSubscription.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
