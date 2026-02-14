// TanStack Query hooks for Portal User
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PortalUser } from '../types/portal-user.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PortalUserListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Portal User records.
 */
export function usePortalUserList(
  params: PortalUserListParams = {},
  options?: Omit<UseQueryOptions<PortalUser[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.portalUser.list(params),
    queryFn: () => apiGet<PortalUser[]>(`/portal-user${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Portal User by ID.
 */
export function usePortalUser(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PortalUser | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.portalUser.detail(id ?? ''),
    queryFn: () => apiGet<PortalUser | null>(`/portal-user/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Portal User.
 * Automatically invalidates list queries on success.
 */
export function useCreatePortalUser(
  options?: UseMutationOptions<PortalUser, Error, Partial<PortalUser>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PortalUser>) => apiPost<PortalUser>('/portal-user', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portalUser.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Portal User.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePortalUser(
  options?: UseMutationOptions<PortalUser, Error, { id: string; data: Partial<PortalUser> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PortalUser> }) =>
      apiPut<PortalUser>(`/portal-user/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portalUser.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.portalUser.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Portal User by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePortalUser(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/portal-user/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portalUser.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
