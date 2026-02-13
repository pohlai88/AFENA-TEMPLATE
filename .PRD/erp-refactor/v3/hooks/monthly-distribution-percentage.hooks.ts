// TanStack Query hooks for Monthly Distribution Percentage
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MonthlyDistributionPercentage } from '../types/monthly-distribution-percentage.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MonthlyDistributionPercentageListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Monthly Distribution Percentage records.
 */
export function useMonthlyDistributionPercentageList(
  params: MonthlyDistributionPercentageListParams = {},
  options?: Omit<UseQueryOptions<MonthlyDistributionPercentage[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.monthlyDistributionPercentage.list(params),
    queryFn: () => apiGet<MonthlyDistributionPercentage[]>(`/monthly-distribution-percentage${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Monthly Distribution Percentage by ID.
 */
export function useMonthlyDistributionPercentage(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MonthlyDistributionPercentage | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.monthlyDistributionPercentage.detail(id ?? ''),
    queryFn: () => apiGet<MonthlyDistributionPercentage | null>(`/monthly-distribution-percentage/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Monthly Distribution Percentage.
 * Automatically invalidates list queries on success.
 */
export function useCreateMonthlyDistributionPercentage(
  options?: UseMutationOptions<MonthlyDistributionPercentage, Error, Partial<MonthlyDistributionPercentage>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MonthlyDistributionPercentage>) => apiPost<MonthlyDistributionPercentage>('/monthly-distribution-percentage', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyDistributionPercentage.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Monthly Distribution Percentage.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMonthlyDistributionPercentage(
  options?: UseMutationOptions<MonthlyDistributionPercentage, Error, { id: string; data: Partial<MonthlyDistributionPercentage> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MonthlyDistributionPercentage> }) =>
      apiPut<MonthlyDistributionPercentage>(`/monthly-distribution-percentage/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyDistributionPercentage.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyDistributionPercentage.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Monthly Distribution Percentage by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMonthlyDistributionPercentage(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/monthly-distribution-percentage/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.monthlyDistributionPercentage.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
