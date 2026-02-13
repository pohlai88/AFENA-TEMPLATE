// TanStack Query hooks for Party Link
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PartyLink } from '../types/party-link.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PartyLinkListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Party Link records.
 */
export function usePartyLinkList(
  params: PartyLinkListParams = {},
  options?: Omit<UseQueryOptions<PartyLink[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.partyLink.list(params),
    queryFn: () => apiGet<PartyLink[]>(`/party-link${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Party Link by ID.
 */
export function usePartyLink(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PartyLink | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.partyLink.detail(id ?? ''),
    queryFn: () => apiGet<PartyLink | null>(`/party-link/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Party Link.
 * Automatically invalidates list queries on success.
 */
export function useCreatePartyLink(
  options?: UseMutationOptions<PartyLink, Error, Partial<PartyLink>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PartyLink>) => apiPost<PartyLink>('/party-link', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyLink.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Party Link.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePartyLink(
  options?: UseMutationOptions<PartyLink, Error, { id: string; data: Partial<PartyLink> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartyLink> }) =>
      apiPut<PartyLink>(`/party-link/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyLink.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partyLink.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Party Link by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePartyLink(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/party-link/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyLink.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
