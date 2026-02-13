// TanStack Query hooks for Pricing Rule Item Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PricingRuleItemGroup } from '../types/pricing-rule-item-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PricingRuleItemGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pricing Rule Item Group records.
 */
export function usePricingRuleItemGroupList(
  params: PricingRuleItemGroupListParams = {},
  options?: Omit<UseQueryOptions<PricingRuleItemGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.pricingRuleItemGroup.list(params),
    queryFn: () => apiGet<PricingRuleItemGroup[]>(`/pricing-rule-item-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pricing Rule Item Group by ID.
 */
export function usePricingRuleItemGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PricingRuleItemGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.pricingRuleItemGroup.detail(id ?? ''),
    queryFn: () => apiGet<PricingRuleItemGroup | null>(`/pricing-rule-item-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pricing Rule Item Group.
 * Automatically invalidates list queries on success.
 */
export function useCreatePricingRuleItemGroup(
  options?: UseMutationOptions<PricingRuleItemGroup, Error, Partial<PricingRuleItemGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PricingRuleItemGroup>) => apiPost<PricingRuleItemGroup>('/pricing-rule-item-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleItemGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pricing Rule Item Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePricingRuleItemGroup(
  options?: UseMutationOptions<PricingRuleItemGroup, Error, { id: string; data: Partial<PricingRuleItemGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PricingRuleItemGroup> }) =>
      apiPut<PricingRuleItemGroup>(`/pricing-rule-item-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleItemGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleItemGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pricing Rule Item Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePricingRuleItemGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pricing-rule-item-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pricingRuleItemGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
