// TanStack Query hooks for POS Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosSettings } from '../types/pos-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Settings records.
 */
export function usePosSettingsList(
  params: PosSettingsListParams = {},
  options?: Omit<UseQueryOptions<PosSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posSettings.list(params),
    queryFn: () => apiGet<PosSettings[]>(`/pos-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Settings by ID.
 */
export function usePosSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posSettings.detail(id ?? ''),
    queryFn: () => apiGet<PosSettings | null>(`/pos-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosSettings(
  options?: UseMutationOptions<PosSettings, Error, Partial<PosSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosSettings>) => apiPost<PosSettings>('/pos-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosSettings(
  options?: UseMutationOptions<PosSettings, Error, { id: string; data: Partial<PosSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosSettings> }) =>
      apiPut<PosSettings>(`/pos-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
