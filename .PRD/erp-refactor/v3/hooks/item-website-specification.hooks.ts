// TanStack Query hooks for Item Website Specification
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemWebsiteSpecification } from '../types/item-website-specification.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemWebsiteSpecificationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Website Specification records.
 */
export function useItemWebsiteSpecificationList(
  params: ItemWebsiteSpecificationListParams = {},
  options?: Omit<UseQueryOptions<ItemWebsiteSpecification[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemWebsiteSpecification.list(params),
    queryFn: () => apiGet<ItemWebsiteSpecification[]>(`/item-website-specification${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Website Specification by ID.
 */
export function useItemWebsiteSpecification(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemWebsiteSpecification | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemWebsiteSpecification.detail(id ?? ''),
    queryFn: () => apiGet<ItemWebsiteSpecification | null>(`/item-website-specification/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Website Specification.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemWebsiteSpecification(
  options?: UseMutationOptions<ItemWebsiteSpecification, Error, Partial<ItemWebsiteSpecification>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemWebsiteSpecification>) => apiPost<ItemWebsiteSpecification>('/item-website-specification', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemWebsiteSpecification.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Website Specification.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemWebsiteSpecification(
  options?: UseMutationOptions<ItemWebsiteSpecification, Error, { id: string; data: Partial<ItemWebsiteSpecification> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemWebsiteSpecification> }) =>
      apiPut<ItemWebsiteSpecification>(`/item-website-specification/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemWebsiteSpecification.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemWebsiteSpecification.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Website Specification by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemWebsiteSpecification(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-website-specification/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemWebsiteSpecification.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
