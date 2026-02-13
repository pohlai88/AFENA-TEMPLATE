// TanStack Query hooks for Buying Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BuyingSettings } from '../types/buying-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BuyingSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Buying Settings records.
 */
export function useBuyingSettingsList(
  params: BuyingSettingsListParams = {},
  options?: Omit<UseQueryOptions<BuyingSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.buyingSettings.list(params),
    queryFn: () => apiGet<BuyingSettings[]>(`/buying-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Buying Settings by ID.
 */
export function useBuyingSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BuyingSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.buyingSettings.detail(id ?? ''),
    queryFn: () => apiGet<BuyingSettings | null>(`/buying-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Buying Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateBuyingSettings(
  options?: UseMutationOptions<BuyingSettings, Error, Partial<BuyingSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BuyingSettings>) => apiPost<BuyingSettings>('/buying-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buyingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Buying Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBuyingSettings(
  options?: UseMutationOptions<BuyingSettings, Error, { id: string; data: Partial<BuyingSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BuyingSettings> }) =>
      apiPut<BuyingSettings>(`/buying-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buyingSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.buyingSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Buying Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBuyingSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/buying-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buyingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
