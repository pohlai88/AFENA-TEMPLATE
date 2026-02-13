// TanStack Query hooks for Product Bundle
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductBundle } from '../types/product-bundle.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductBundleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Product Bundle records.
 */
export function useProductBundleList(
  params: ProductBundleListParams = {},
  options?: Omit<UseQueryOptions<ProductBundle[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productBundle.list(params),
    queryFn: () => apiGet<ProductBundle[]>(`/product-bundle${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Product Bundle by ID.
 */
export function useProductBundle(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductBundle | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productBundle.detail(id ?? ''),
    queryFn: () => apiGet<ProductBundle | null>(`/product-bundle/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Product Bundle.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductBundle(
  options?: UseMutationOptions<ProductBundle, Error, Partial<ProductBundle>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductBundle>) => apiPost<ProductBundle>('/product-bundle', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productBundle.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Product Bundle.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductBundle(
  options?: UseMutationOptions<ProductBundle, Error, { id: string; data: Partial<ProductBundle> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductBundle> }) =>
      apiPut<ProductBundle>(`/product-bundle/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productBundle.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productBundle.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Product Bundle by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductBundle(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/product-bundle/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productBundle.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
