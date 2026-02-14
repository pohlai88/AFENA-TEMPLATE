// TanStack Query hooks for POS Item Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosItemGroup } from '../types/pos-item-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosItemGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Item Group records.
 */
export function usePosItemGroupList(
  params: PosItemGroupListParams = {},
  options?: Omit<UseQueryOptions<PosItemGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posItemGroup.list(params),
    queryFn: () => apiGet<PosItemGroup[]>(`/pos-item-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Item Group by ID.
 */
export function usePosItemGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosItemGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posItemGroup.detail(id ?? ''),
    queryFn: () => apiGet<PosItemGroup | null>(`/pos-item-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Item Group.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosItemGroup(
  options?: UseMutationOptions<PosItemGroup, Error, Partial<PosItemGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosItemGroup>) => apiPost<PosItemGroup>('/pos-item-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posItemGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Item Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosItemGroup(
  options?: UseMutationOptions<PosItemGroup, Error, { id: string; data: Partial<PosItemGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosItemGroup> }) =>
      apiPut<PosItemGroup>(`/pos-item-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posItemGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posItemGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Item Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosItemGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-item-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posItemGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
