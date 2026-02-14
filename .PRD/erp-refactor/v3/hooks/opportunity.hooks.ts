// TanStack Query hooks for Opportunity
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Opportunity } from '../types/opportunity.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OpportunityListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Opportunity records.
 */
export function useOpportunityList(
  params: OpportunityListParams = {},
  options?: Omit<UseQueryOptions<Opportunity[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.opportunity.list(params),
    queryFn: () => apiGet<Opportunity[]>(`/opportunity${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Opportunity by ID.
 */
export function useOpportunity(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Opportunity | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.opportunity.detail(id ?? ''),
    queryFn: () => apiGet<Opportunity | null>(`/opportunity/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Opportunity.
 * Automatically invalidates list queries on success.
 */
export function useCreateOpportunity(
  options?: UseMutationOptions<Opportunity, Error, Partial<Opportunity>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Opportunity>) => apiPost<Opportunity>('/opportunity', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunity.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Opportunity.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOpportunity(
  options?: UseMutationOptions<Opportunity, Error, { id: string; data: Partial<Opportunity> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) =>
      apiPut<Opportunity>(`/opportunity/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunity.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunity.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Opportunity by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOpportunity(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/opportunity/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunity.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
