// TanStack Query hooks for Lost Reason Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LostReasonDetail } from '../types/lost-reason-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LostReasonDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Lost Reason Detail records.
 */
export function useLostReasonDetailList(
  params: LostReasonDetailListParams = {},
  options?: Omit<UseQueryOptions<LostReasonDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.lostReasonDetail.list(params),
    queryFn: () => apiGet<LostReasonDetail[]>(`/lost-reason-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Lost Reason Detail by ID.
 */
export function useLostReasonDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LostReasonDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.lostReasonDetail.detail(id ?? ''),
    queryFn: () => apiGet<LostReasonDetail | null>(`/lost-reason-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Lost Reason Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateLostReasonDetail(
  options?: UseMutationOptions<LostReasonDetail, Error, Partial<LostReasonDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LostReasonDetail>) => apiPost<LostReasonDetail>('/lost-reason-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lostReasonDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Lost Reason Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLostReasonDetail(
  options?: UseMutationOptions<LostReasonDetail, Error, { id: string; data: Partial<LostReasonDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LostReasonDetail> }) =>
      apiPut<LostReasonDetail>(`/lost-reason-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lostReasonDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.lostReasonDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Lost Reason Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLostReasonDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/lost-reason-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lostReasonDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
