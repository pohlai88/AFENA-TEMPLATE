// TanStack Query hooks for Stock Reposting Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockRepostingSettings } from '../types/stock-reposting-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockRepostingSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Reposting Settings records.
 */
export function useStockRepostingSettingsList(
  params: StockRepostingSettingsListParams = {},
  options?: Omit<UseQueryOptions<StockRepostingSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockRepostingSettings.list(params),
    queryFn: () => apiGet<StockRepostingSettings[]>(`/stock-reposting-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Reposting Settings by ID.
 */
export function useStockRepostingSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockRepostingSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockRepostingSettings.detail(id ?? ''),
    queryFn: () => apiGet<StockRepostingSettings | null>(`/stock-reposting-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Reposting Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockRepostingSettings(
  options?: UseMutationOptions<StockRepostingSettings, Error, Partial<StockRepostingSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockRepostingSettings>) => apiPost<StockRepostingSettings>('/stock-reposting-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockRepostingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Reposting Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockRepostingSettings(
  options?: UseMutationOptions<StockRepostingSettings, Error, { id: string; data: Partial<StockRepostingSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockRepostingSettings> }) =>
      apiPut<StockRepostingSettings>(`/stock-reposting-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockRepostingSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockRepostingSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Reposting Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockRepostingSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-reposting-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockRepostingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
