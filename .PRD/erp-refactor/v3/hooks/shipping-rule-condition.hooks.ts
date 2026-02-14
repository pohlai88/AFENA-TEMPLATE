// TanStack Query hooks for Shipping Rule Condition
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShippingRuleCondition } from '../types/shipping-rule-condition.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShippingRuleConditionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Shipping Rule Condition records.
 */
export function useShippingRuleConditionList(
  params: ShippingRuleConditionListParams = {},
  options?: Omit<UseQueryOptions<ShippingRuleCondition[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shippingRuleCondition.list(params),
    queryFn: () => apiGet<ShippingRuleCondition[]>(`/shipping-rule-condition${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Shipping Rule Condition by ID.
 */
export function useShippingRuleCondition(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShippingRuleCondition | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shippingRuleCondition.detail(id ?? ''),
    queryFn: () => apiGet<ShippingRuleCondition | null>(`/shipping-rule-condition/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Shipping Rule Condition.
 * Automatically invalidates list queries on success.
 */
export function useCreateShippingRuleCondition(
  options?: UseMutationOptions<ShippingRuleCondition, Error, Partial<ShippingRuleCondition>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShippingRuleCondition>) => apiPost<ShippingRuleCondition>('/shipping-rule-condition', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRuleCondition.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Shipping Rule Condition.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShippingRuleCondition(
  options?: UseMutationOptions<ShippingRuleCondition, Error, { id: string; data: Partial<ShippingRuleCondition> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShippingRuleCondition> }) =>
      apiPut<ShippingRuleCondition>(`/shipping-rule-condition/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRuleCondition.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRuleCondition.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Shipping Rule Condition by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShippingRuleCondition(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/shipping-rule-condition/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRuleCondition.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
