// TanStack Query hooks for South Africa VAT Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SouthAfricaVatSettings } from '../types/south-africa-vat-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SouthAfricaVatSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of South Africa VAT Settings records.
 */
export function useSouthAfricaVatSettingsList(
  params: SouthAfricaVatSettingsListParams = {},
  options?: Omit<UseQueryOptions<SouthAfricaVatSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.southAfricaVatSettings.list(params),
    queryFn: () => apiGet<SouthAfricaVatSettings[]>(`/south-africa-vat-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single South Africa VAT Settings by ID.
 */
export function useSouthAfricaVatSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SouthAfricaVatSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.southAfricaVatSettings.detail(id ?? ''),
    queryFn: () => apiGet<SouthAfricaVatSettings | null>(`/south-africa-vat-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new South Africa VAT Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateSouthAfricaVatSettings(
  options?: UseMutationOptions<SouthAfricaVatSettings, Error, Partial<SouthAfricaVatSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SouthAfricaVatSettings>) => apiPost<SouthAfricaVatSettings>('/south-africa-vat-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.southAfricaVatSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing South Africa VAT Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSouthAfricaVatSettings(
  options?: UseMutationOptions<SouthAfricaVatSettings, Error, { id: string; data: Partial<SouthAfricaVatSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SouthAfricaVatSettings> }) =>
      apiPut<SouthAfricaVatSettings>(`/south-africa-vat-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.southAfricaVatSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.southAfricaVatSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a South Africa VAT Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSouthAfricaVatSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/south-africa-vat-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.southAfricaVatSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
