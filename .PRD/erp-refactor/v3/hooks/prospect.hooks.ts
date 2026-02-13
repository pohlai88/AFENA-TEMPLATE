// TanStack Query hooks for Prospect
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Prospect } from '../types/prospect.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProspectListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Prospect records.
 */
export function useProspectList(
  params: ProspectListParams = {},
  options?: Omit<UseQueryOptions<Prospect[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.prospect.list(params),
    queryFn: () => apiGet<Prospect[]>(`/prospect${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Prospect by ID.
 */
export function useProspect(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Prospect | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.prospect.detail(id ?? ''),
    queryFn: () => apiGet<Prospect | null>(`/prospect/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Prospect.
 * Automatically invalidates list queries on success.
 */
export function useCreateProspect(
  options?: UseMutationOptions<Prospect, Error, Partial<Prospect>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Prospect>) => apiPost<Prospect>('/prospect', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospect.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Prospect.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProspect(
  options?: UseMutationOptions<Prospect, Error, { id: string; data: Partial<Prospect> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Prospect> }) =>
      apiPut<Prospect>(`/prospect/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospect.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.prospect.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Prospect by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProspect(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/prospect/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospect.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
