// TanStack Query hooks for Pricing Rule Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PricingRuleDetail } from '../types/pricing-rule-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PricingRuleDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pricing Rule Detail records.
 */
export function usePricingRuleDetailList(
  params: PricingRuleDetailListParams = {},
  options?: Omit<UseQueryOptions<PricingRuleDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.pricingRuleDetail.list(params),
    queryFn: () => apiGet<PricingRuleDetail[]>(`/pricing-rule-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pricing Rule Detail by ID.
 */
export function usePricingRuleDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PricingRuleDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.pricingRuleDetail.detail(id ?? ''),
    queryFn: () => apiGet<PricingRuleDetail | null>(`/pricing-rule-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pricing Rule Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreatePricingRuleDetail(
  options?: UseMutationOptions<PricingRuleDetail, Error, Partial<PricingRuleDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PricingRuleDetail>) => apiPost<PricingRuleDetail>('/pricing-rule-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pricing Rule Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePricingRuleDetail(
  options?: UseMutationOptions<PricingRuleDetail, Error, { id: string; data: Partial<PricingRuleDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PricingRuleDetail> }) =>
      apiPut<PricingRuleDetail>(`/pricing-rule-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pricing Rule Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePricingRuleDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pricing-rule-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
