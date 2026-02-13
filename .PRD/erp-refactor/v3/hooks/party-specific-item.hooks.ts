// TanStack Query hooks for Party Specific Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PartySpecificItem } from '../types/party-specific-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PartySpecificItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Party Specific Item records.
 */
export function usePartySpecificItemList(
  params: PartySpecificItemListParams = {},
  options?: Omit<UseQueryOptions<PartySpecificItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.partySpecificItem.list(params),
    queryFn: () => apiGet<PartySpecificItem[]>(`/party-specific-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Party Specific Item by ID.
 */
export function usePartySpecificItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PartySpecificItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.partySpecificItem.detail(id ?? ''),
    queryFn: () => apiGet<PartySpecificItem | null>(`/party-specific-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Party Specific Item.
 * Automatically invalidates list queries on success.
 */
export function useCreatePartySpecificItem(
  options?: UseMutationOptions<PartySpecificItem, Error, Partial<PartySpecificItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PartySpecificItem>) => apiPost<PartySpecificItem>('/party-specific-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partySpecificItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Party Specific Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePartySpecificItem(
  options?: UseMutationOptions<PartySpecificItem, Error, { id: string; data: Partial<PartySpecificItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartySpecificItem> }) =>
      apiPut<PartySpecificItem>(`/party-specific-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partySpecificItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partySpecificItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Party Specific Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePartySpecificItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/party-specific-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partySpecificItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
