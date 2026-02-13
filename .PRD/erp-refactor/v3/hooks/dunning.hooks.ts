// TanStack Query hooks for Dunning
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Dunning } from '../types/dunning.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DunningListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Dunning records.
 */
export function useDunningList(
  params: DunningListParams = {},
  options?: Omit<UseQueryOptions<Dunning[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.dunning.list(params),
    queryFn: () => apiGet<Dunning[]>(`/dunning${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Dunning by ID.
 */
export function useDunning(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Dunning | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.dunning.detail(id ?? ''),
    queryFn: () => apiGet<Dunning | null>(`/dunning/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Dunning.
 * Automatically invalidates list queries on success.
 */
export function useCreateDunning(
  options?: UseMutationOptions<Dunning, Error, Partial<Dunning>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Dunning>) => apiPost<Dunning>('/dunning', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunning.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Dunning.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDunning(
  options?: UseMutationOptions<Dunning, Error, { id: string; data: Partial<Dunning> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Dunning> }) =>
      apiPut<Dunning>(`/dunning/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunning.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dunning.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Dunning by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDunning(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/dunning/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunning.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Dunning (set docstatus = 1).
 */
export function useSubmitDunning(
  options?: UseMutationOptions<Dunning, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Dunning>(`/dunning/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunning.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dunning.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Dunning (set docstatus = 2).
 */
export function useCancelDunning(
  options?: UseMutationOptions<Dunning, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Dunning>(`/dunning/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunning.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dunning.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
