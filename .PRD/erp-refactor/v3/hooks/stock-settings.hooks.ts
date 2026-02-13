// TanStack Query hooks for Stock Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockSettings } from '../types/stock-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Settings records.
 */
export function useStockSettingsList(
  params: StockSettingsListParams = {},
  options?: Omit<UseQueryOptions<StockSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockSettings.list(params),
    queryFn: () => apiGet<StockSettings[]>(`/stock-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Settings by ID.
 */
export function useStockSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockSettings.detail(id ?? ''),
    queryFn: () => apiGet<StockSettings | null>(`/stock-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockSettings(
  options?: UseMutationOptions<StockSettings, Error, Partial<StockSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockSettings>) => apiPost<StockSettings>('/stock-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockSettings(
  options?: UseMutationOptions<StockSettings, Error, { id: string; data: Partial<StockSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockSettings> }) =>
      apiPut<StockSettings>(`/stock-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
