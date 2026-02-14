// TanStack Query hooks for Stock Entry Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { StockEntryDetail } from '../types/stock-entry-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface StockEntryDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Stock Entry Detail records.
 */
export function useStockEntryDetailList(
  params: StockEntryDetailListParams = {},
  options?: Omit<UseQueryOptions<StockEntryDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.stockEntryDetail.list(params),
    queryFn: () => apiGet<StockEntryDetail[]>(`/stock-entry-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Stock Entry Detail by ID.
 */
export function useStockEntryDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<StockEntryDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.stockEntryDetail.detail(id ?? ''),
    queryFn: () => apiGet<StockEntryDetail | null>(`/stock-entry-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Stock Entry Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateStockEntryDetail(
  options?: UseMutationOptions<StockEntryDetail, Error, Partial<StockEntryDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<StockEntryDetail>) => apiPost<StockEntryDetail>('/stock-entry-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntryDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Stock Entry Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateStockEntryDetail(
  options?: UseMutationOptions<StockEntryDetail, Error, { id: string; data: Partial<StockEntryDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StockEntryDetail> }) =>
      apiPut<StockEntryDetail>(`/stock-entry-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntryDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntryDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Stock Entry Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteStockEntryDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/stock-entry-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.stockEntryDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
