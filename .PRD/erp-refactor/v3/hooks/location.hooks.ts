// TanStack Query hooks for Location
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Location } from '../types/location.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LocationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Location records.
 */
export function useLocationList(
  params: LocationListParams = {},
  options?: Omit<UseQueryOptions<Location[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.location.list(params),
    queryFn: () => apiGet<Location[]>(`/location${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Location by ID.
 */
export function useLocation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Location | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.location.detail(id ?? ''),
    queryFn: () => apiGet<Location | null>(`/location/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Location.
 * Automatically invalidates list queries on success.
 */
export function useCreateLocation(
  options?: UseMutationOptions<Location, Error, Partial<Location>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Location>) => apiPost<Location>('/location', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.location.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Location.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLocation(
  options?: UseMutationOptions<Location, Error, { id: string; data: Partial<Location> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Location> }) =>
      apiPut<Location>(`/location/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.location.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.location.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Location by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLocation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/location/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.location.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
