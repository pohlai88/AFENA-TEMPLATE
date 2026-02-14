// TanStack Query hooks for Asset Finance Book
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AssetFinanceBook } from '../types/asset-finance-book.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AssetFinanceBookListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Asset Finance Book records.
 */
export function useAssetFinanceBookList(
  params: AssetFinanceBookListParams = {},
  options?: Omit<UseQueryOptions<AssetFinanceBook[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.assetFinanceBook.list(params),
    queryFn: () => apiGet<AssetFinanceBook[]>(`/asset-finance-book${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Asset Finance Book by ID.
 */
export function useAssetFinanceBook(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AssetFinanceBook | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.assetFinanceBook.detail(id ?? ''),
    queryFn: () => apiGet<AssetFinanceBook | null>(`/asset-finance-book/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Asset Finance Book.
 * Automatically invalidates list queries on success.
 */
export function useCreateAssetFinanceBook(
  options?: UseMutationOptions<AssetFinanceBook, Error, Partial<AssetFinanceBook>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AssetFinanceBook>) => apiPost<AssetFinanceBook>('/asset-finance-book', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetFinanceBook.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Asset Finance Book.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAssetFinanceBook(
  options?: UseMutationOptions<AssetFinanceBook, Error, { id: string; data: Partial<AssetFinanceBook> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetFinanceBook> }) =>
      apiPut<AssetFinanceBook>(`/asset-finance-book/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetFinanceBook.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.assetFinanceBook.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Asset Finance Book by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAssetFinanceBook(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/asset-finance-book/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.assetFinanceBook.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
