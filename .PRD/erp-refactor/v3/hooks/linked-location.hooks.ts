// TanStack Query hooks for Linked Location
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LinkedLocation } from '../types/linked-location.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LinkedLocationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Linked Location records.
 */
export function useLinkedLocationList(
  params: LinkedLocationListParams = {},
  options?: Omit<UseQueryOptions<LinkedLocation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.linkedLocation.list(params),
    queryFn: () => apiGet<LinkedLocation[]>(`/linked-location${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Linked Location by ID.
 */
export function useLinkedLocation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LinkedLocation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.linkedLocation.detail(id ?? ''),
    queryFn: () => apiGet<LinkedLocation | null>(`/linked-location/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Linked Location.
 * Automatically invalidates list queries on success.
 */
export function useCreateLinkedLocation(
  options?: UseMutationOptions<LinkedLocation, Error, Partial<LinkedLocation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LinkedLocation>) => apiPost<LinkedLocation>('/linked-location', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.linkedLocation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Linked Location.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLinkedLocation(
  options?: UseMutationOptions<LinkedLocation, Error, { id: string; data: Partial<LinkedLocation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LinkedLocation> }) =>
      apiPut<LinkedLocation>(`/linked-location/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.linkedLocation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.linkedLocation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Linked Location by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLinkedLocation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/linked-location/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.linkedLocation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
