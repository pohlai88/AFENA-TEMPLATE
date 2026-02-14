// TanStack Query hooks for Pricing Rule Brand
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PricingRuleBrand } from '../types/pricing-rule-brand.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PricingRuleBrandListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pricing Rule Brand records.
 */
export function usePricingRuleBrandList(
  params: PricingRuleBrandListParams = {},
  options?: Omit<UseQueryOptions<PricingRuleBrand[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.pricingRuleBrand.list(params),
    queryFn: () => apiGet<PricingRuleBrand[]>(`/pricing-rule-brand${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pricing Rule Brand by ID.
 */
export function usePricingRuleBrand(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PricingRuleBrand | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.pricingRuleBrand.detail(id ?? ''),
    queryFn: () => apiGet<PricingRuleBrand | null>(`/pricing-rule-brand/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pricing Rule Brand.
 * Automatically invalidates list queries on success.
 */
export function useCreatePricingRuleBrand(
  options?: UseMutationOptions<PricingRuleBrand, Error, Partial<PricingRuleBrand>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PricingRuleBrand>) => apiPost<PricingRuleBrand>('/pricing-rule-brand', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleBrand.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pricing Rule Brand.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePricingRuleBrand(
  options?: UseMutationOptions<PricingRuleBrand, Error, { id: string; data: Partial<PricingRuleBrand> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PricingRuleBrand> }) =>
      apiPut<PricingRuleBrand>(`/pricing-rule-brand/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleBrand.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleBrand.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pricing Rule Brand by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePricingRuleBrand(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pricing-rule-brand/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleBrand.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
