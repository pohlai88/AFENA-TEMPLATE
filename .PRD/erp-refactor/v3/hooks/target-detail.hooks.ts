// TanStack Query hooks for Target Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TargetDetail } from '../types/target-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TargetDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Target Detail records.
 */
export function useTargetDetailList(
  params: TargetDetailListParams = {},
  options?: Omit<UseQueryOptions<TargetDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.targetDetail.list(params),
    queryFn: () => apiGet<TargetDetail[]>(`/target-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Target Detail by ID.
 */
export function useTargetDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TargetDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.targetDetail.detail(id ?? ''),
    queryFn: () => apiGet<TargetDetail | null>(`/target-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Target Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateTargetDetail(
  options?: UseMutationOptions<TargetDetail, Error, Partial<TargetDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TargetDetail>) => apiPost<TargetDetail>('/target-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.targetDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Target Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTargetDetail(
  options?: UseMutationOptions<TargetDetail, Error, { id: string; data: Partial<TargetDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TargetDetail> }) =>
      apiPut<TargetDetail>(`/target-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.targetDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.targetDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Target Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTargetDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/target-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.targetDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
