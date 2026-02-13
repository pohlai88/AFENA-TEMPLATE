// TanStack Query hooks for Tax Rule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaxRule } from '../types/tax-rule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaxRuleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Tax Rule records.
 */
export function useTaxRuleList(
  params: TaxRuleListParams = {},
  options?: Omit<UseQueryOptions<TaxRule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taxRule.list(params),
    queryFn: () => apiGet<TaxRule[]>(`/tax-rule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Tax Rule by ID.
 */
export function useTaxRule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaxRule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taxRule.detail(id ?? ''),
    queryFn: () => apiGet<TaxRule | null>(`/tax-rule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Tax Rule.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaxRule(
  options?: UseMutationOptions<TaxRule, Error, Partial<TaxRule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaxRule>) => apiPost<TaxRule>('/tax-rule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Tax Rule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaxRule(
  options?: UseMutationOptions<TaxRule, Error, { id: string; data: Partial<TaxRule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaxRule> }) =>
      apiPut<TaxRule>(`/tax-rule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxRule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxRule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Tax Rule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaxRule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tax-rule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
