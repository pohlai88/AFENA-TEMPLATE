// TanStack Query hooks for Driver
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Driver } from '../types/driver.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DriverListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Driver records.
 */
export function useDriverList(
  params: DriverListParams = {},
  options?: Omit<UseQueryOptions<Driver[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.driver.list(params),
    queryFn: () => apiGet<Driver[]>(`/driver${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Driver by ID.
 */
export function useDriver(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Driver | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.driver.detail(id ?? ''),
    queryFn: () => apiGet<Driver | null>(`/driver/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Driver.
 * Automatically invalidates list queries on success.
 */
export function useCreateDriver(
  options?: UseMutationOptions<Driver, Error, Partial<Driver>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Driver>) => apiPost<Driver>('/driver', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Driver.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDriver(
  options?: UseMutationOptions<Driver, Error, { id: string; data: Partial<Driver> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Driver> }) =>
      apiPut<Driver>(`/driver/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Driver by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDriver(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/driver/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.driver.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
