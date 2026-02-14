// TanStack Query hooks for Authorization Control
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AuthorizationControl } from '../types/authorization-control.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AuthorizationControlListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Authorization Control records.
 */
export function useAuthorizationControlList(
  params: AuthorizationControlListParams = {},
  options?: Omit<UseQueryOptions<AuthorizationControl[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.authorizationControl.list(params),
    queryFn: () => apiGet<AuthorizationControl[]>(`/authorization-control${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Authorization Control by ID.
 */
export function useAuthorizationControl(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AuthorizationControl | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.authorizationControl.detail(id ?? ''),
    queryFn: () => apiGet<AuthorizationControl | null>(`/authorization-control/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Authorization Control.
 * Automatically invalidates list queries on success.
 */
export function useCreateAuthorizationControl(
  options?: UseMutationOptions<AuthorizationControl, Error, Partial<AuthorizationControl>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AuthorizationControl>) => apiPost<AuthorizationControl>('/authorization-control', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authorizationControl.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Authorization Control.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAuthorizationControl(
  options?: UseMutationOptions<AuthorizationControl, Error, { id: string; data: Partial<AuthorizationControl> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AuthorizationControl> }) =>
      apiPut<AuthorizationControl>(`/authorization-control/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authorizationControl.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.authorizationControl.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Authorization Control by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAuthorizationControl(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/authorization-control/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authorizationControl.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
