// TanStack Query hooks for Opportunity Lost Reason
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { OpportunityLostReason } from '../types/opportunity-lost-reason.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OpportunityLostReasonListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Opportunity Lost Reason records.
 */
export function useOpportunityLostReasonList(
  params: OpportunityLostReasonListParams = {},
  options?: Omit<UseQueryOptions<OpportunityLostReason[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.opportunityLostReason.list(params),
    queryFn: () => apiGet<OpportunityLostReason[]>(`/opportunity-lost-reason${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Opportunity Lost Reason by ID.
 */
export function useOpportunityLostReason(
  id: string | undefined,
  options?: Omit<UseQueryOptions<OpportunityLostReason | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.opportunityLostReason.detail(id ?? ''),
    queryFn: () => apiGet<OpportunityLostReason | null>(`/opportunity-lost-reason/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Opportunity Lost Reason.
 * Automatically invalidates list queries on success.
 */
export function useCreateOpportunityLostReason(
  options?: UseMutationOptions<OpportunityLostReason, Error, Partial<OpportunityLostReason>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<OpportunityLostReason>) => apiPost<OpportunityLostReason>('/opportunity-lost-reason', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityLostReason.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Opportunity Lost Reason.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOpportunityLostReason(
  options?: UseMutationOptions<OpportunityLostReason, Error, { id: string; data: Partial<OpportunityLostReason> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpportunityLostReason> }) =>
      apiPut<OpportunityLostReason>(`/opportunity-lost-reason/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityLostReason.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityLostReason.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Opportunity Lost Reason by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOpportunityLostReason(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/opportunity-lost-reason/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityLostReason.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
