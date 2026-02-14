// TanStack Query hooks for Brand
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Brand } from '../types/brand.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BrandListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Brand records.
 */
export function useBrandList(
  params: BrandListParams = {},
  options?: Omit<UseQueryOptions<Brand[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.brand.list(params),
    queryFn: () => apiGet<Brand[]>(`/brand${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Brand by ID.
 */
export function useBrand(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Brand | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.brand.detail(id ?? ''),
    queryFn: () => apiGet<Brand | null>(`/brand/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Brand.
 * Automatically invalidates list queries on success.
 */
export function useCreateBrand(
  options?: UseMutationOptions<Brand, Error, Partial<Brand>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Brand>) => apiPost<Brand>('/brand', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brand.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Brand.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBrand(
  options?: UseMutationOptions<Brand, Error, { id: string; data: Partial<Brand> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Brand> }) =>
      apiPut<Brand>(`/brand/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brand.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.brand.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Brand by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBrand(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/brand/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brand.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
