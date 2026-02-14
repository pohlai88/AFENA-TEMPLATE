// TanStack Query hooks for POS Customer Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosCustomerGroup } from '../types/pos-customer-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosCustomerGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Customer Group records.
 */
export function usePosCustomerGroupList(
  params: PosCustomerGroupListParams = {},
  options?: Omit<UseQueryOptions<PosCustomerGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posCustomerGroup.list(params),
    queryFn: () => apiGet<PosCustomerGroup[]>(`/pos-customer-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Customer Group by ID.
 */
export function usePosCustomerGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosCustomerGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posCustomerGroup.detail(id ?? ''),
    queryFn: () => apiGet<PosCustomerGroup | null>(`/pos-customer-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Customer Group.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosCustomerGroup(
  options?: UseMutationOptions<PosCustomerGroup, Error, Partial<PosCustomerGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosCustomerGroup>) => apiPost<PosCustomerGroup>('/pos-customer-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posCustomerGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Customer Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosCustomerGroup(
  options?: UseMutationOptions<PosCustomerGroup, Error, { id: string; data: Partial<PosCustomerGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosCustomerGroup> }) =>
      apiPut<PosCustomerGroup>(`/pos-customer-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posCustomerGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posCustomerGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Customer Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosCustomerGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-customer-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posCustomerGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
