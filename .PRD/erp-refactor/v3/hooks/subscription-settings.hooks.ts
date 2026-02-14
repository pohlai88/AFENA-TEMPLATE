// TanStack Query hooks for Subscription Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubscriptionSettings } from '../types/subscription-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubscriptionSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subscription Settings records.
 */
export function useSubscriptionSettingsList(
  params: SubscriptionSettingsListParams = {},
  options?: Omit<UseQueryOptions<SubscriptionSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subscriptionSettings.list(params),
    queryFn: () => apiGet<SubscriptionSettings[]>(`/subscription-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subscription Settings by ID.
 */
export function useSubscriptionSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubscriptionSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subscriptionSettings.detail(id ?? ''),
    queryFn: () => apiGet<SubscriptionSettings | null>(`/subscription-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subscription Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubscriptionSettings(
  options?: UseMutationOptions<SubscriptionSettings, Error, Partial<SubscriptionSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubscriptionSettings>) => apiPost<SubscriptionSettings>('/subscription-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subscription Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubscriptionSettings(
  options?: UseMutationOptions<SubscriptionSettings, Error, { id: string; data: Partial<SubscriptionSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubscriptionSettings> }) =>
      apiPut<SubscriptionSettings>(`/subscription-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subscription Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubscriptionSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subscription-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
