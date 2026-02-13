// TanStack Query hooks for Item Variant Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemVariantSettings } from '../types/item-variant-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemVariantSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Variant Settings records.
 */
export function useItemVariantSettingsList(
  params: ItemVariantSettingsListParams = {},
  options?: Omit<UseQueryOptions<ItemVariantSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemVariantSettings.list(params),
    queryFn: () => apiGet<ItemVariantSettings[]>(`/item-variant-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Variant Settings by ID.
 */
export function useItemVariantSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemVariantSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemVariantSettings.detail(id ?? ''),
    queryFn: () => apiGet<ItemVariantSettings | null>(`/item-variant-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Variant Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemVariantSettings(
  options?: UseMutationOptions<ItemVariantSettings, Error, Partial<ItemVariantSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemVariantSettings>) => apiPost<ItemVariantSettings>('/item-variant-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariantSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Variant Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemVariantSettings(
  options?: UseMutationOptions<ItemVariantSettings, Error, { id: string; data: Partial<ItemVariantSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemVariantSettings> }) =>
      apiPut<ItemVariantSettings>(`/item-variant-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariantSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariantSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Variant Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemVariantSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-variant-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariantSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
