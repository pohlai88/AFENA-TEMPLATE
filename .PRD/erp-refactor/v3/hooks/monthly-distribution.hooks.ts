// TanStack Query hooks for Monthly Distribution
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MonthlyDistribution } from '../types/monthly-distribution.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MonthlyDistributionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Monthly Distribution records.
 */
export function useMonthlyDistributionList(
  params: MonthlyDistributionListParams = {},
  options?: Omit<UseQueryOptions<MonthlyDistribution[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.monthlyDistribution.list(params),
    queryFn: () => apiGet<MonthlyDistribution[]>(`/monthly-distribution${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Monthly Distribution by ID.
 */
export function useMonthlyDistribution(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MonthlyDistribution | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.monthlyDistribution.detail(id ?? ''),
    queryFn: () => apiGet<MonthlyDistribution | null>(`/monthly-distribution/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Monthly Distribution.
 * Automatically invalidates list queries on success.
 */
export function useCreateMonthlyDistribution(
  options?: UseMutationOptions<MonthlyDistribution, Error, Partial<MonthlyDistribution>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MonthlyDistribution>) => apiPost<MonthlyDistribution>('/monthly-distribution', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyDistribution.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Monthly Distribution.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMonthlyDistribution(
  options?: UseMutationOptions<MonthlyDistribution, Error, { id: string; data: Partial<MonthlyDistribution> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MonthlyDistribution> }) =>
      apiPut<MonthlyDistribution>(`/monthly-distribution/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyDistribution.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyDistribution.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Monthly Distribution by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMonthlyDistribution(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/monthly-distribution/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyDistribution.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
