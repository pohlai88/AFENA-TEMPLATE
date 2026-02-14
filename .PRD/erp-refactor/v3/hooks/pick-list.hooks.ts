// TanStack Query hooks for Pick List
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PickList } from '../types/pick-list.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PickListListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pick List records.
 */
export function usePickListList(
  params: PickListListParams = {},
  options?: Omit<UseQueryOptions<PickList[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.pickList.list(params),
    queryFn: () => apiGet<PickList[]>(`/pick-list${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pick List by ID.
 */
export function usePickList(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PickList | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.pickList.detail(id ?? ''),
    queryFn: () => apiGet<PickList | null>(`/pick-list/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pick List.
 * Automatically invalidates list queries on success.
 */
export function useCreatePickList(
  options?: UseMutationOptions<PickList, Error, Partial<PickList>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PickList>) => apiPost<PickList>('/pick-list', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickList.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pick List.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePickList(
  options?: UseMutationOptions<PickList, Error, { id: string; data: Partial<PickList> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PickList> }) =>
      apiPut<PickList>(`/pick-list/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickList.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pickList.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pick List by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePickList(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pick-list/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickList.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Pick List (set docstatus = 1).
 */
export function useSubmitPickList(
  options?: UseMutationOptions<PickList, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PickList>(`/pick-list/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickList.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pickList.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Pick List (set docstatus = 2).
 */
export function useCancelPickList(
  options?: UseMutationOptions<PickList, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PickList>(`/pick-list/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickList.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pickList.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
