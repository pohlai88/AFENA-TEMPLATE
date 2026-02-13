// TanStack Query hooks for Repost Item Valuation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RepostItemValuation } from '../types/repost-item-valuation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RepostItemValuationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Repost Item Valuation records.
 */
export function useRepostItemValuationList(
  params: RepostItemValuationListParams = {},
  options?: Omit<UseQueryOptions<RepostItemValuation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.repostItemValuation.list(params),
    queryFn: () => apiGet<RepostItemValuation[]>(`/repost-item-valuation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Repost Item Valuation by ID.
 */
export function useRepostItemValuation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RepostItemValuation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.repostItemValuation.detail(id ?? ''),
    queryFn: () => apiGet<RepostItemValuation | null>(`/repost-item-valuation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Repost Item Valuation.
 * Automatically invalidates list queries on success.
 */
export function useCreateRepostItemValuation(
  options?: UseMutationOptions<RepostItemValuation, Error, Partial<RepostItemValuation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RepostItemValuation>) => apiPost<RepostItemValuation>('/repost-item-valuation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostItemValuation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Repost Item Valuation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRepostItemValuation(
  options?: UseMutationOptions<RepostItemValuation, Error, { id: string; data: Partial<RepostItemValuation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepostItemValuation> }) =>
      apiPut<RepostItemValuation>(`/repost-item-valuation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostItemValuation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostItemValuation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Repost Item Valuation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRepostItemValuation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/repost-item-valuation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostItemValuation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Repost Item Valuation (set docstatus = 1).
 */
export function useSubmitRepostItemValuation(
  options?: UseMutationOptions<RepostItemValuation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<RepostItemValuation>(`/repost-item-valuation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostItemValuation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostItemValuation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Repost Item Valuation (set docstatus = 2).
 */
export function useCancelRepostItemValuation(
  options?: UseMutationOptions<RepostItemValuation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<RepostItemValuation>(`/repost-item-valuation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostItemValuation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostItemValuation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
