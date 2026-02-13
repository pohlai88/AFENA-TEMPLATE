// TanStack Query hooks for Product Bundle Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductBundleItem } from '../types/product-bundle-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductBundleItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Product Bundle Item records.
 */
export function useProductBundleItemList(
  params: ProductBundleItemListParams = {},
  options?: Omit<UseQueryOptions<ProductBundleItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productBundleItem.list(params),
    queryFn: () => apiGet<ProductBundleItem[]>(`/product-bundle-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Product Bundle Item by ID.
 */
export function useProductBundleItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductBundleItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productBundleItem.detail(id ?? ''),
    queryFn: () => apiGet<ProductBundleItem | null>(`/product-bundle-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Product Bundle Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductBundleItem(
  options?: UseMutationOptions<ProductBundleItem, Error, Partial<ProductBundleItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductBundleItem>) => apiPost<ProductBundleItem>('/product-bundle-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productBundleItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Product Bundle Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductBundleItem(
  options?: UseMutationOptions<ProductBundleItem, Error, { id: string; data: Partial<ProductBundleItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductBundleItem> }) =>
      apiPut<ProductBundleItem>(`/product-bundle-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productBundleItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productBundleItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Product Bundle Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductBundleItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/product-bundle-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productBundleItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
