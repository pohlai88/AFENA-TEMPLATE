// TanStack Query hooks for Tax Category
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaxCategory } from '../types/tax-category.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaxCategoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Tax Category records.
 */
export function useTaxCategoryList(
  params: TaxCategoryListParams = {},
  options?: Omit<UseQueryOptions<TaxCategory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taxCategory.list(params),
    queryFn: () => apiGet<TaxCategory[]>(`/tax-category${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Tax Category by ID.
 */
export function useTaxCategory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaxCategory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taxCategory.detail(id ?? ''),
    queryFn: () => apiGet<TaxCategory | null>(`/tax-category/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Tax Category.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaxCategory(
  options?: UseMutationOptions<TaxCategory, Error, Partial<TaxCategory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaxCategory>) => apiPost<TaxCategory>('/tax-category', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Tax Category.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaxCategory(
  options?: UseMutationOptions<TaxCategory, Error, { id: string; data: Partial<TaxCategory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaxCategory> }) =>
      apiPut<TaxCategory>(`/tax-category/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxCategory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxCategory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Tax Category by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaxCategory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tax-category/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
