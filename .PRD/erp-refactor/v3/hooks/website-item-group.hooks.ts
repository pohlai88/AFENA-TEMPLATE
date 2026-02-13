// TanStack Query hooks for Website Item Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WebsiteItemGroup } from '../types/website-item-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WebsiteItemGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Website Item Group records.
 */
export function useWebsiteItemGroupList(
  params: WebsiteItemGroupListParams = {},
  options?: Omit<UseQueryOptions<WebsiteItemGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.websiteItemGroup.list(params),
    queryFn: () => apiGet<WebsiteItemGroup[]>(`/website-item-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Website Item Group by ID.
 */
export function useWebsiteItemGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WebsiteItemGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.websiteItemGroup.detail(id ?? ''),
    queryFn: () => apiGet<WebsiteItemGroup | null>(`/website-item-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Website Item Group.
 * Automatically invalidates list queries on success.
 */
export function useCreateWebsiteItemGroup(
  options?: UseMutationOptions<WebsiteItemGroup, Error, Partial<WebsiteItemGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WebsiteItemGroup>) => apiPost<WebsiteItemGroup>('/website-item-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteItemGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Website Item Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWebsiteItemGroup(
  options?: UseMutationOptions<WebsiteItemGroup, Error, { id: string; data: Partial<WebsiteItemGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WebsiteItemGroup> }) =>
      apiPut<WebsiteItemGroup>(`/website-item-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteItemGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteItemGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Website Item Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWebsiteItemGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/website-item-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteItemGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
