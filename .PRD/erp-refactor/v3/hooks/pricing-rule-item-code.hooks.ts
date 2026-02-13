// TanStack Query hooks for Pricing Rule Item Code
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PricingRuleItemCode } from '../types/pricing-rule-item-code.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PricingRuleItemCodeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pricing Rule Item Code records.
 */
export function usePricingRuleItemCodeList(
  params: PricingRuleItemCodeListParams = {},
  options?: Omit<UseQueryOptions<PricingRuleItemCode[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.pricingRuleItemCode.list(params),
    queryFn: () => apiGet<PricingRuleItemCode[]>(`/pricing-rule-item-code${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pricing Rule Item Code by ID.
 */
export function usePricingRuleItemCode(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PricingRuleItemCode | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.pricingRuleItemCode.detail(id ?? ''),
    queryFn: () => apiGet<PricingRuleItemCode | null>(`/pricing-rule-item-code/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pricing Rule Item Code.
 * Automatically invalidates list queries on success.
 */
export function useCreatePricingRuleItemCode(
  options?: UseMutationOptions<PricingRuleItemCode, Error, Partial<PricingRuleItemCode>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PricingRuleItemCode>) => apiPost<PricingRuleItemCode>('/pricing-rule-item-code', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleItemCode.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pricing Rule Item Code.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePricingRuleItemCode(
  options?: UseMutationOptions<PricingRuleItemCode, Error, { id: string; data: Partial<PricingRuleItemCode> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PricingRuleItemCode> }) =>
      apiPut<PricingRuleItemCode>(`/pricing-rule-item-code/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleItemCode.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleItemCode.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pricing Rule Item Code by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePricingRuleItemCode(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pricing-rule-item-code/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleItemCode.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
