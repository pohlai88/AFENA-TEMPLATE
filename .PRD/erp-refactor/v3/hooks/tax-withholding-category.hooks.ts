// TanStack Query hooks for Tax Withholding Category
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaxWithholdingCategory } from '../types/tax-withholding-category.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaxWithholdingCategoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Tax Withholding Category records.
 */
export function useTaxWithholdingCategoryList(
  params: TaxWithholdingCategoryListParams = {},
  options?: Omit<UseQueryOptions<TaxWithholdingCategory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taxWithholdingCategory.list(params),
    queryFn: () => apiGet<TaxWithholdingCategory[]>(`/tax-withholding-category${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Tax Withholding Category by ID.
 */
export function useTaxWithholdingCategory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaxWithholdingCategory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taxWithholdingCategory.detail(id ?? ''),
    queryFn: () => apiGet<TaxWithholdingCategory | null>(`/tax-withholding-category/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Tax Withholding Category.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaxWithholdingCategory(
  options?: UseMutationOptions<TaxWithholdingCategory, Error, Partial<TaxWithholdingCategory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaxWithholdingCategory>) => apiPost<TaxWithholdingCategory>('/tax-withholding-category', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Tax Withholding Category.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaxWithholdingCategory(
  options?: UseMutationOptions<TaxWithholdingCategory, Error, { id: string; data: Partial<TaxWithholdingCategory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaxWithholdingCategory> }) =>
      apiPut<TaxWithholdingCategory>(`/tax-withholding-category/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingCategory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingCategory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Tax Withholding Category by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaxWithholdingCategory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tax-withholding-category/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
