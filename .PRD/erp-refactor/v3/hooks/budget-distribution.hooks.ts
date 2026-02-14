// TanStack Query hooks for Budget Distribution
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BudgetDistribution } from '../types/budget-distribution.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BudgetDistributionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Budget Distribution records.
 */
export function useBudgetDistributionList(
  params: BudgetDistributionListParams = {},
  options?: Omit<UseQueryOptions<BudgetDistribution[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.budgetDistribution.list(params),
    queryFn: () => apiGet<BudgetDistribution[]>(`/budget-distribution${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Budget Distribution by ID.
 */
export function useBudgetDistribution(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BudgetDistribution | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.budgetDistribution.detail(id ?? ''),
    queryFn: () => apiGet<BudgetDistribution | null>(`/budget-distribution/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Budget Distribution.
 * Automatically invalidates list queries on success.
 */
export function useCreateBudgetDistribution(
  options?: UseMutationOptions<BudgetDistribution, Error, Partial<BudgetDistribution>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BudgetDistribution>) => apiPost<BudgetDistribution>('/budget-distribution', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetDistribution.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Budget Distribution.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBudgetDistribution(
  options?: UseMutationOptions<BudgetDistribution, Error, { id: string; data: Partial<BudgetDistribution> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetDistribution> }) =>
      apiPut<BudgetDistribution>(`/budget-distribution/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetDistribution.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetDistribution.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Budget Distribution by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBudgetDistribution(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/budget-distribution/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetDistribution.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
