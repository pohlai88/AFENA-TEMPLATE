// TanStack Query hooks for Website Filter Field
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WebsiteFilterField } from '../types/website-filter-field.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WebsiteFilterFieldListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Website Filter Field records.
 */
export function useWebsiteFilterFieldList(
  params: WebsiteFilterFieldListParams = {},
  options?: Omit<UseQueryOptions<WebsiteFilterField[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.websiteFilterField.list(params),
    queryFn: () => apiGet<WebsiteFilterField[]>(`/website-filter-field${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Website Filter Field by ID.
 */
export function useWebsiteFilterField(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WebsiteFilterField | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.websiteFilterField.detail(id ?? ''),
    queryFn: () => apiGet<WebsiteFilterField | null>(`/website-filter-field/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Website Filter Field.
 * Automatically invalidates list queries on success.
 */
export function useCreateWebsiteFilterField(
  options?: UseMutationOptions<WebsiteFilterField, Error, Partial<WebsiteFilterField>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WebsiteFilterField>) => apiPost<WebsiteFilterField>('/website-filter-field', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteFilterField.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Website Filter Field.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWebsiteFilterField(
  options?: UseMutationOptions<WebsiteFilterField, Error, { id: string; data: Partial<WebsiteFilterField> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WebsiteFilterField> }) =>
      apiPut<WebsiteFilterField>(`/website-filter-field/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteFilterField.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteFilterField.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Website Filter Field by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWebsiteFilterField(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/website-filter-field/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.websiteFilterField.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
