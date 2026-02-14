// TanStack Query hooks for Supplier
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Supplier } from '../types/supplier.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier records.
 */
export function useSupplierList(
  params: SupplierListParams = {},
  options?: Omit<UseQueryOptions<Supplier[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplier.list(params),
    queryFn: () => apiGet<Supplier[]>(`/supplier${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier by ID.
 */
export function useSupplier(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Supplier | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplier.detail(id ?? ''),
    queryFn: () => apiGet<Supplier | null>(`/supplier/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplier(
  options?: UseMutationOptions<Supplier, Error, Partial<Supplier>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Supplier>) => apiPost<Supplier>('/supplier', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplier.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplier(
  options?: UseMutationOptions<Supplier, Error, { id: string; data: Partial<Supplier> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Supplier> }) =>
      apiPut<Supplier>(`/supplier/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplier.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplier.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplier(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplier.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
