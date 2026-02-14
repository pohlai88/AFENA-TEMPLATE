// TanStack Query hooks for UAE VAT Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { UaeVatSettings } from '../types/uae-vat-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface UaeVatSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of UAE VAT Settings records.
 */
export function useUaeVatSettingsList(
  params: UaeVatSettingsListParams = {},
  options?: Omit<UseQueryOptions<UaeVatSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.uaeVatSettings.list(params),
    queryFn: () => apiGet<UaeVatSettings[]>(`/uae-vat-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single UAE VAT Settings by ID.
 */
export function useUaeVatSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<UaeVatSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.uaeVatSettings.detail(id ?? ''),
    queryFn: () => apiGet<UaeVatSettings | null>(`/uae-vat-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new UAE VAT Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateUaeVatSettings(
  options?: UseMutationOptions<UaeVatSettings, Error, Partial<UaeVatSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UaeVatSettings>) => apiPost<UaeVatSettings>('/uae-vat-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uaeVatSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing UAE VAT Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateUaeVatSettings(
  options?: UseMutationOptions<UaeVatSettings, Error, { id: string; data: Partial<UaeVatSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UaeVatSettings> }) =>
      apiPut<UaeVatSettings>(`/uae-vat-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uaeVatSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uaeVatSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a UAE VAT Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteUaeVatSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/uae-vat-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uaeVatSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
