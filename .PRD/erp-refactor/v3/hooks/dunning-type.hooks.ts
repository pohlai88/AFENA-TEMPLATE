// TanStack Query hooks for Dunning Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DunningType } from '../types/dunning-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DunningTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Dunning Type records.
 */
export function useDunningTypeList(
  params: DunningTypeListParams = {},
  options?: Omit<UseQueryOptions<DunningType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.dunningType.list(params),
    queryFn: () => apiGet<DunningType[]>(`/dunning-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Dunning Type by ID.
 */
export function useDunningType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DunningType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.dunningType.detail(id ?? ''),
    queryFn: () => apiGet<DunningType | null>(`/dunning-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Dunning Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateDunningType(
  options?: UseMutationOptions<DunningType, Error, Partial<DunningType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DunningType>) => apiPost<DunningType>('/dunning-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunningType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Dunning Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDunningType(
  options?: UseMutationOptions<DunningType, Error, { id: string; data: Partial<DunningType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DunningType> }) =>
      apiPut<DunningType>(`/dunning-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunningType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.dunningType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Dunning Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDunningType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/dunning-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.dunningType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
