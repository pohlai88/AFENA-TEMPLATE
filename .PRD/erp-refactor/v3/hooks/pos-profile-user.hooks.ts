// TanStack Query hooks for POS Profile User
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosProfileUser } from '../types/pos-profile-user.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosProfileUserListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Profile User records.
 */
export function usePosProfileUserList(
  params: PosProfileUserListParams = {},
  options?: Omit<UseQueryOptions<PosProfileUser[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posProfileUser.list(params),
    queryFn: () => apiGet<PosProfileUser[]>(`/pos-profile-user${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Profile User by ID.
 */
export function usePosProfileUser(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosProfileUser | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posProfileUser.detail(id ?? ''),
    queryFn: () => apiGet<PosProfileUser | null>(`/pos-profile-user/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Profile User.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosProfileUser(
  options?: UseMutationOptions<PosProfileUser, Error, Partial<PosProfileUser>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosProfileUser>) => apiPost<PosProfileUser>('/pos-profile-user', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posProfileUser.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Profile User.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosProfileUser(
  options?: UseMutationOptions<PosProfileUser, Error, { id: string; data: Partial<PosProfileUser> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosProfileUser> }) =>
      apiPut<PosProfileUser>(`/pos-profile-user/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posProfileUser.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posProfileUser.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Profile User by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosProfileUser(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-profile-user/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posProfileUser.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
