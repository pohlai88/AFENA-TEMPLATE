// TanStack Query hooks for UOM Category
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { UomCategory } from '../types/uom-category.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface UomCategoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of UOM Category records.
 */
export function useUomCategoryList(
  params: UomCategoryListParams = {},
  options?: Omit<UseQueryOptions<UomCategory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.uomCategory.list(params),
    queryFn: () => apiGet<UomCategory[]>(`/uom-category${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single UOM Category by ID.
 */
export function useUomCategory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<UomCategory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.uomCategory.detail(id ?? ''),
    queryFn: () => apiGet<UomCategory | null>(`/uom-category/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new UOM Category.
 * Automatically invalidates list queries on success.
 */
export function useCreateUomCategory(
  options?: UseMutationOptions<UomCategory, Error, Partial<UomCategory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UomCategory>) => apiPost<UomCategory>('/uom-category', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing UOM Category.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateUomCategory(
  options?: UseMutationOptions<UomCategory, Error, { id: string; data: Partial<UomCategory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UomCategory> }) =>
      apiPut<UomCategory>(`/uom-category/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomCategory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uomCategory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a UOM Category by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteUomCategory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/uom-category/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uomCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
