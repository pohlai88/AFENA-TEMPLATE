// TanStack Query hooks for Promotional Scheme Product Discount
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PromotionalSchemeProductDiscount } from '../types/promotional-scheme-product-discount.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PromotionalSchemeProductDiscountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Promotional Scheme Product Discount records.
 */
export function usePromotionalSchemeProductDiscountList(
  params: PromotionalSchemeProductDiscountListParams = {},
  options?: Omit<UseQueryOptions<PromotionalSchemeProductDiscount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.promotionalSchemeProductDiscount.list(params),
    queryFn: () => apiGet<PromotionalSchemeProductDiscount[]>(`/promotional-scheme-product-discount${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Promotional Scheme Product Discount by ID.
 */
export function usePromotionalSchemeProductDiscount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PromotionalSchemeProductDiscount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.promotionalSchemeProductDiscount.detail(id ?? ''),
    queryFn: () => apiGet<PromotionalSchemeProductDiscount | null>(`/promotional-scheme-product-discount/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Promotional Scheme Product Discount.
 * Automatically invalidates list queries on success.
 */
export function useCreatePromotionalSchemeProductDiscount(
  options?: UseMutationOptions<PromotionalSchemeProductDiscount, Error, Partial<PromotionalSchemeProductDiscount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PromotionalSchemeProductDiscount>) => apiPost<PromotionalSchemeProductDiscount>('/promotional-scheme-product-discount', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalSchemeProductDiscount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Promotional Scheme Product Discount.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePromotionalSchemeProductDiscount(
  options?: UseMutationOptions<PromotionalSchemeProductDiscount, Error, { id: string; data: Partial<PromotionalSchemeProductDiscount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromotionalSchemeProductDiscount> }) =>
      apiPut<PromotionalSchemeProductDiscount>(`/promotional-scheme-product-discount/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalSchemeProductDiscount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalSchemeProductDiscount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Promotional Scheme Product Discount by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePromotionalSchemeProductDiscount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/promotional-scheme-product-discount/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalSchemeProductDiscount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
