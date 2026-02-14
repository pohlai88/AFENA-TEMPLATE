// TanStack Query hooks for Stock Entry Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockEntryType } from '../types/stock-entry-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockEntryTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Entry Type records.
 */
export function useStockEntryTypeList(
  params: StockEntryTypeListParams = {},
  options?: Omit<UseQueryOptions<StockEntryType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockEntryType.list(params),
    queryFn: () => apiGet<StockEntryType[]>(`/stock-entry-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Entry Type by ID.
 */
export function useStockEntryType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockEntryType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockEntryType.detail(id ?? ''),
    queryFn: () => apiGet<StockEntryType | null>(`/stock-entry-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Entry Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockEntryType(
  options?: UseMutationOptions<StockEntryType, Error, Partial<StockEntryType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockEntryType>) => apiPost<StockEntryType>('/stock-entry-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntryType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Entry Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockEntryType(
  options?: UseMutationOptions<StockEntryType, Error, { id: string; data: Partial<StockEntryType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockEntryType> }) =>
      apiPut<StockEntryType>(`/stock-entry-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntryType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntryType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Entry Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockEntryType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-entry-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntryType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
