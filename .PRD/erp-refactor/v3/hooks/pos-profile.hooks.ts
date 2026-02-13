// TanStack Query hooks for POS Profile
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosProfile } from '../types/pos-profile.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosProfileListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Profile records.
 */
export function usePosProfileList(
  params: PosProfileListParams = {},
  options?: Omit<UseQueryOptions<PosProfile[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posProfile.list(params),
    queryFn: () => apiGet<PosProfile[]>(`/pos-profile${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Profile by ID.
 */
export function usePosProfile(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosProfile | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posProfile.detail(id ?? ''),
    queryFn: () => apiGet<PosProfile | null>(`/pos-profile/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Profile.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosProfile(
  options?: UseMutationOptions<PosProfile, Error, Partial<PosProfile>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosProfile>) => apiPost<PosProfile>('/pos-profile', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posProfile.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Profile.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosProfile(
  options?: UseMutationOptions<PosProfile, Error, { id: string; data: Partial<PosProfile> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosProfile> }) =>
      apiPut<PosProfile>(`/pos-profile/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posProfile.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posProfile.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Profile by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosProfile(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-profile/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posProfile.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
