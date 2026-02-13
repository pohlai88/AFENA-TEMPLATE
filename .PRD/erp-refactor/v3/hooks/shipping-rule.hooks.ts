// TanStack Query hooks for Shipping Rule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShippingRule } from '../types/shipping-rule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShippingRuleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Shipping Rule records.
 */
export function useShippingRuleList(
  params: ShippingRuleListParams = {},
  options?: Omit<UseQueryOptions<ShippingRule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shippingRule.list(params),
    queryFn: () => apiGet<ShippingRule[]>(`/shipping-rule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Shipping Rule by ID.
 */
export function useShippingRule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShippingRule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shippingRule.detail(id ?? ''),
    queryFn: () => apiGet<ShippingRule | null>(`/shipping-rule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Shipping Rule.
 * Automatically invalidates list queries on success.
 */
export function useCreateShippingRule(
  options?: UseMutationOptions<ShippingRule, Error, Partial<ShippingRule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShippingRule>) => apiPost<ShippingRule>('/shipping-rule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Shipping Rule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShippingRule(
  options?: UseMutationOptions<ShippingRule, Error, { id: string; data: Partial<ShippingRule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShippingRule> }) =>
      apiPut<ShippingRule>(`/shipping-rule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Shipping Rule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShippingRule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/shipping-rule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shippingRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
