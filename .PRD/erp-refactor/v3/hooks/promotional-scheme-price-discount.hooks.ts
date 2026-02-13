// TanStack Query hooks for Promotional Scheme Price Discount
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PromotionalSchemePriceDiscount } from '../types/promotional-scheme-price-discount.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PromotionalSchemePriceDiscountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Promotional Scheme Price Discount records.
 */
export function usePromotionalSchemePriceDiscountList(
  params: PromotionalSchemePriceDiscountListParams = {},
  options?: Omit<UseQueryOptions<PromotionalSchemePriceDiscount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.promotionalSchemePriceDiscount.list(params),
    queryFn: () => apiGet<PromotionalSchemePriceDiscount[]>(`/promotional-scheme-price-discount${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Promotional Scheme Price Discount by ID.
 */
export function usePromotionalSchemePriceDiscount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PromotionalSchemePriceDiscount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.promotionalSchemePriceDiscount.detail(id ?? ''),
    queryFn: () => apiGet<PromotionalSchemePriceDiscount | null>(`/promotional-scheme-price-discount/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Promotional Scheme Price Discount.
 * Automatically invalidates list queries on success.
 */
export function useCreatePromotionalSchemePriceDiscount(
  options?: UseMutationOptions<PromotionalSchemePriceDiscount, Error, Partial<PromotionalSchemePriceDiscount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PromotionalSchemePriceDiscount>) => apiPost<PromotionalSchemePriceDiscount>('/promotional-scheme-price-discount', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalSchemePriceDiscount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Promotional Scheme Price Discount.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePromotionalSchemePriceDiscount(
  options?: UseMutationOptions<PromotionalSchemePriceDiscount, Error, { id: string; data: Partial<PromotionalSchemePriceDiscount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromotionalSchemePriceDiscount> }) =>
      apiPut<PromotionalSchemePriceDiscount>(`/promotional-scheme-price-discount/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalSchemePriceDiscount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalSchemePriceDiscount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Promotional Scheme Price Discount by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePromotionalSchemePriceDiscount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/promotional-scheme-price-discount/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalSchemePriceDiscount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
