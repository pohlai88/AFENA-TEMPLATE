// TanStack Query hooks for Party Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PartyType } from '../types/party-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PartyTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Party Type records.
 */
export function usePartyTypeList(
  params: PartyTypeListParams = {},
  options?: Omit<UseQueryOptions<PartyType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.partyType.list(params),
    queryFn: () => apiGet<PartyType[]>(`/party-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Party Type by ID.
 */
export function usePartyType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PartyType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.partyType.detail(id ?? ''),
    queryFn: () => apiGet<PartyType | null>(`/party-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Party Type.
 * Automatically invalidates list queries on success.
 */
export function useCreatePartyType(
  options?: UseMutationOptions<PartyType, Error, Partial<PartyType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PartyType>) => apiPost<PartyType>('/party-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Party Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePartyType(
  options?: UseMutationOptions<PartyType, Error, { id: string; data: Partial<PartyType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartyType> }) =>
      apiPut<PartyType>(`/party-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partyType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Party Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePartyType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/party-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
