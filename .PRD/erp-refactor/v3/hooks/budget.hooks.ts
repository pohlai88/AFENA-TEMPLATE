// TanStack Query hooks for Budget
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Budget } from '../types/budget.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BudgetListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Budget records.
 */
export function useBudgetList(
  params: BudgetListParams = {},
  options?: Omit<UseQueryOptions<Budget[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.budget.list(params),
    queryFn: () => apiGet<Budget[]>(`/budget${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Budget by ID.
 */
export function useBudget(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Budget | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.budget.detail(id ?? ''),
    queryFn: () => apiGet<Budget | null>(`/budget/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Budget.
 * Automatically invalidates list queries on success.
 */
export function useCreateBudget(
  options?: UseMutationOptions<Budget, Error, Partial<Budget>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Budget>) => apiPost<Budget>('/budget', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Budget.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBudget(
  options?: UseMutationOptions<Budget, Error, { id: string; data: Partial<Budget> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Budget> }) =>
      apiPut<Budget>(`/budget/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Budget by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBudget(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/budget/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Budget (set docstatus = 1).
 */
export function useSubmitBudget(
  options?: UseMutationOptions<Budget, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Budget>(`/budget/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Budget (set docstatus = 2).
 */
export function useCancelBudget(
  options?: UseMutationOptions<Budget, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Budget>(`/budget/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.budget.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
