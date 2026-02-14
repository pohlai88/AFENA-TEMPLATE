// TanStack Query hooks for CRM Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CrmSettings } from '../types/crm-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CrmSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of CRM Settings records.
 */
export function useCrmSettingsList(
  params: CrmSettingsListParams = {},
  options?: Omit<UseQueryOptions<CrmSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.crmSettings.list(params),
    queryFn: () => apiGet<CrmSettings[]>(`/crm-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single CRM Settings by ID.
 */
export function useCrmSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CrmSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.crmSettings.detail(id ?? ''),
    queryFn: () => apiGet<CrmSettings | null>(`/crm-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new CRM Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateCrmSettings(
  options?: UseMutationOptions<CrmSettings, Error, Partial<CrmSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CrmSettings>) => apiPost<CrmSettings>('/crm-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.crmSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing CRM Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCrmSettings(
  options?: UseMutationOptions<CrmSettings, Error, { id: string; data: Partial<CrmSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CrmSettings> }) =>
      apiPut<CrmSettings>(`/crm-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.crmSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.crmSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a CRM Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCrmSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/crm-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.crmSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
