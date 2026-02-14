// TanStack Query hooks for Website Attribute
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WebsiteAttribute } from '../types/website-attribute.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WebsiteAttributeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Website Attribute records.
 */
export function useWebsiteAttributeList(
  params: WebsiteAttributeListParams = {},
  options?: Omit<UseQueryOptions<WebsiteAttribute[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.websiteAttribute.list(params),
    queryFn: () => apiGet<WebsiteAttribute[]>(`/website-attribute${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Website Attribute by ID.
 */
export function useWebsiteAttribute(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WebsiteAttribute | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.websiteAttribute.detail(id ?? ''),
    queryFn: () => apiGet<WebsiteAttribute | null>(`/website-attribute/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Website Attribute.
 * Automatically invalidates list queries on success.
 */
export function useCreateWebsiteAttribute(
  options?: UseMutationOptions<WebsiteAttribute, Error, Partial<WebsiteAttribute>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WebsiteAttribute>) => apiPost<WebsiteAttribute>('/website-attribute', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteAttribute.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Website Attribute.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWebsiteAttribute(
  options?: UseMutationOptions<WebsiteAttribute, Error, { id: string; data: Partial<WebsiteAttribute> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WebsiteAttribute> }) =>
      apiPut<WebsiteAttribute>(`/website-attribute/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteAttribute.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteAttribute.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Website Attribute by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWebsiteAttribute(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/website-attribute/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteAttribute.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
