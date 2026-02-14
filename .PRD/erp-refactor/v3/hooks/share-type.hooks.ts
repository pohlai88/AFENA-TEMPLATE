// TanStack Query hooks for Share Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShareType } from '../types/share-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShareTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Share Type records.
 */
export function useShareTypeList(
  params: ShareTypeListParams = {},
  options?: Omit<UseQueryOptions<ShareType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shareType.list(params),
    queryFn: () => apiGet<ShareType[]>(`/share-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Share Type by ID.
 */
export function useShareType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShareType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shareType.detail(id ?? ''),
    queryFn: () => apiGet<ShareType | null>(`/share-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Share Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateShareType(
  options?: UseMutationOptions<ShareType, Error, Partial<ShareType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShareType>) => apiPost<ShareType>('/share-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Share Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShareType(
  options?: UseMutationOptions<ShareType, Error, { id: string; data: Partial<ShareType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShareType> }) =>
      apiPut<ShareType>(`/share-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shareType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Share Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShareType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/share-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
