// TanStack Query hooks for Promotional Scheme
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PromotionalScheme } from '../types/promotional-scheme.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PromotionalSchemeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Promotional Scheme records.
 */
export function usePromotionalSchemeList(
  params: PromotionalSchemeListParams = {},
  options?: Omit<UseQueryOptions<PromotionalScheme[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.promotionalScheme.list(params),
    queryFn: () => apiGet<PromotionalScheme[]>(`/promotional-scheme${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Promotional Scheme by ID.
 */
export function usePromotionalScheme(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PromotionalScheme | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.promotionalScheme.detail(id ?? ''),
    queryFn: () => apiGet<PromotionalScheme | null>(`/promotional-scheme/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Promotional Scheme.
 * Automatically invalidates list queries on success.
 */
export function useCreatePromotionalScheme(
  options?: UseMutationOptions<PromotionalScheme, Error, Partial<PromotionalScheme>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PromotionalScheme>) => apiPost<PromotionalScheme>('/promotional-scheme', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalScheme.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Promotional Scheme.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePromotionalScheme(
  options?: UseMutationOptions<PromotionalScheme, Error, { id: string; data: Partial<PromotionalScheme> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromotionalScheme> }) =>
      apiPut<PromotionalScheme>(`/promotional-scheme/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalScheme.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalScheme.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Promotional Scheme by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePromotionalScheme(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/promotional-scheme/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotionalScheme.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
