// TanStack Query hooks for Pricing Rule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PricingRule } from '../types/pricing-rule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PricingRuleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pricing Rule records.
 */
export function usePricingRuleList(
  params: PricingRuleListParams = {},
  options?: Omit<UseQueryOptions<PricingRule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.pricingRule.list(params),
    queryFn: () => apiGet<PricingRule[]>(`/pricing-rule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pricing Rule by ID.
 */
export function usePricingRule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PricingRule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.pricingRule.detail(id ?? ''),
    queryFn: () => apiGet<PricingRule | null>(`/pricing-rule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pricing Rule.
 * Automatically invalidates list queries on success.
 */
export function useCreatePricingRule(
  options?: UseMutationOptions<PricingRule, Error, Partial<PricingRule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PricingRule>) => apiPost<PricingRule>('/pricing-rule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pricing Rule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePricingRule(
  options?: UseMutationOptions<PricingRule, Error, { id: string; data: Partial<PricingRule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PricingRule> }) =>
      apiPut<PricingRule>(`/pricing-rule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pricing Rule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePricingRule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pricing-rule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
