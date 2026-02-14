// TanStack Query hooks for Support Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupportSettings } from '../types/support-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupportSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Support Settings records.
 */
export function useSupportSettingsList(
  params: SupportSettingsListParams = {},
  options?: Omit<UseQueryOptions<SupportSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supportSettings.list(params),
    queryFn: () => apiGet<SupportSettings[]>(`/support-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Support Settings by ID.
 */
export function useSupportSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupportSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supportSettings.detail(id ?? ''),
    queryFn: () => apiGet<SupportSettings | null>(`/support-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Support Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupportSettings(
  options?: UseMutationOptions<SupportSettings, Error, Partial<SupportSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupportSettings>) => apiPost<SupportSettings>('/support-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supportSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Support Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupportSettings(
  options?: UseMutationOptions<SupportSettings, Error, { id: string; data: Partial<SupportSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupportSettings> }) =>
      apiPut<SupportSettings>(`/support-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supportSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supportSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Support Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupportSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/support-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supportSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
