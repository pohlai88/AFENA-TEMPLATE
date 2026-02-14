// TanStack Query hooks for Manufacturing Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ManufacturingSettings } from '../types/manufacturing-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ManufacturingSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Manufacturing Settings records.
 */
export function useManufacturingSettingsList(
  params: ManufacturingSettingsListParams = {},
  options?: Omit<UseQueryOptions<ManufacturingSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.manufacturingSettings.list(params),
    queryFn: () => apiGet<ManufacturingSettings[]>(`/manufacturing-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Manufacturing Settings by ID.
 */
export function useManufacturingSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ManufacturingSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.manufacturingSettings.detail(id ?? ''),
    queryFn: () => apiGet<ManufacturingSettings | null>(`/manufacturing-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Manufacturing Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateManufacturingSettings(
  options?: UseMutationOptions<ManufacturingSettings, Error, Partial<ManufacturingSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ManufacturingSettings>) => apiPost<ManufacturingSettings>('/manufacturing-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manufacturingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Manufacturing Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateManufacturingSettings(
  options?: UseMutationOptions<ManufacturingSettings, Error, { id: string; data: Partial<ManufacturingSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ManufacturingSettings> }) =>
      apiPut<ManufacturingSettings>(`/manufacturing-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manufacturingSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.manufacturingSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Manufacturing Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteManufacturingSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/manufacturing-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manufacturingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
