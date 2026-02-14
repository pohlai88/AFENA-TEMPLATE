// TanStack Query hooks for Supplier Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierGroup } from '../types/supplier-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Group records.
 */
export function useSupplierGroupList(
  params: SupplierGroupListParams = {},
  options?: Omit<UseQueryOptions<SupplierGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierGroup.list(params),
    queryFn: () => apiGet<SupplierGroup[]>(`/supplier-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Group by ID.
 */
export function useSupplierGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierGroup.detail(id ?? ''),
    queryFn: () => apiGet<SupplierGroup | null>(`/supplier-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Group.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierGroup(
  options?: UseMutationOptions<SupplierGroup, Error, Partial<SupplierGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierGroup>) => apiPost<SupplierGroup>('/supplier-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierGroup(
  options?: UseMutationOptions<SupplierGroup, Error, { id: string; data: Partial<SupplierGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierGroup> }) =>
      apiPut<SupplierGroup>(`/supplier-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
