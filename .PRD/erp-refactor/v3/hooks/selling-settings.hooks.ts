// TanStack Query hooks for Selling Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SellingSettings } from '../types/selling-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SellingSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Selling Settings records.
 */
export function useSellingSettingsList(
  params: SellingSettingsListParams = {},
  options?: Omit<UseQueryOptions<SellingSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.sellingSettings.list(params),
    queryFn: () => apiGet<SellingSettings[]>(`/selling-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Selling Settings by ID.
 */
export function useSellingSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SellingSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.sellingSettings.detail(id ?? ''),
    queryFn: () => apiGet<SellingSettings | null>(`/selling-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Selling Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateSellingSettings(
  options?: UseMutationOptions<SellingSettings, Error, Partial<SellingSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SellingSettings>) => apiPost<SellingSettings>('/selling-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sellingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Selling Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSellingSettings(
  options?: UseMutationOptions<SellingSettings, Error, { id: string; data: Partial<SellingSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SellingSettings> }) =>
      apiPut<SellingSettings>(`/selling-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sellingSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.sellingSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Selling Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSellingSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/selling-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sellingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
