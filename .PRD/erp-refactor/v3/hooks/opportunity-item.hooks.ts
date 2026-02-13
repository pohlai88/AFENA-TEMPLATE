// TanStack Query hooks for Opportunity Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { OpportunityItem } from '../types/opportunity-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OpportunityItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Opportunity Item records.
 */
export function useOpportunityItemList(
  params: OpportunityItemListParams = {},
  options?: Omit<UseQueryOptions<OpportunityItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.opportunityItem.list(params),
    queryFn: () => apiGet<OpportunityItem[]>(`/opportunity-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Opportunity Item by ID.
 */
export function useOpportunityItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<OpportunityItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.opportunityItem.detail(id ?? ''),
    queryFn: () => apiGet<OpportunityItem | null>(`/opportunity-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Opportunity Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateOpportunityItem(
  options?: UseMutationOptions<OpportunityItem, Error, Partial<OpportunityItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<OpportunityItem>) => apiPost<OpportunityItem>('/opportunity-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Opportunity Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOpportunityItem(
  options?: UseMutationOptions<OpportunityItem, Error, { id: string; data: Partial<OpportunityItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpportunityItem> }) =>
      apiPut<OpportunityItem>(`/opportunity-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Opportunity Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOpportunityItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/opportunity-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
