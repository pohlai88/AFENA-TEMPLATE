// TanStack Query hooks for Sales Stage
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesStage } from '../types/sales-stage.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesStageListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Stage records.
 */
export function useSalesStageList(
  params: SalesStageListParams = {},
  options?: Omit<UseQueryOptions<SalesStage[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesStage.list(params),
    queryFn: () => apiGet<SalesStage[]>(`/sales-stage${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Stage by ID.
 */
export function useSalesStage(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesStage | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesStage.detail(id ?? ''),
    queryFn: () => apiGet<SalesStage | null>(`/sales-stage/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Stage.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesStage(
  options?: UseMutationOptions<SalesStage, Error, Partial<SalesStage>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesStage>) => apiPost<SalesStage>('/sales-stage', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesStage.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Stage.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesStage(
  options?: UseMutationOptions<SalesStage, Error, { id: string; data: Partial<SalesStage> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesStage> }) =>
      apiPut<SalesStage>(`/sales-stage/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesStage.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesStage.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Stage by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesStage(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-stage/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesStage.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
