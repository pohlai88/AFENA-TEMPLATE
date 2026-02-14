// TanStack Query hooks for Manufacturer
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Manufacturer } from '../types/manufacturer.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ManufacturerListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Manufacturer records.
 */
export function useManufacturerList(
  params: ManufacturerListParams = {},
  options?: Omit<UseQueryOptions<Manufacturer[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.manufacturer.list(params),
    queryFn: () => apiGet<Manufacturer[]>(`/manufacturer${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Manufacturer by ID.
 */
export function useManufacturer(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Manufacturer | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.manufacturer.detail(id ?? ''),
    queryFn: () => apiGet<Manufacturer | null>(`/manufacturer/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Manufacturer.
 * Automatically invalidates list queries on success.
 */
export function useCreateManufacturer(
  options?: UseMutationOptions<Manufacturer, Error, Partial<Manufacturer>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Manufacturer>) => apiPost<Manufacturer>('/manufacturer', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manufacturer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Manufacturer.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateManufacturer(
  options?: UseMutationOptions<Manufacturer, Error, { id: string; data: Partial<Manufacturer> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Manufacturer> }) =>
      apiPut<Manufacturer>(`/manufacturer/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manufacturer.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.manufacturer.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Manufacturer by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteManufacturer(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/manufacturer/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.manufacturer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
