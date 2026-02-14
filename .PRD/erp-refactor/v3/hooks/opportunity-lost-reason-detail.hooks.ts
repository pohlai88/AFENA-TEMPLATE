// TanStack Query hooks for Opportunity Lost Reason Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { OpportunityLostReasonDetail } from '../types/opportunity-lost-reason-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OpportunityLostReasonDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Opportunity Lost Reason Detail records.
 */
export function useOpportunityLostReasonDetailList(
  params: OpportunityLostReasonDetailListParams = {},
  options?: Omit<UseQueryOptions<OpportunityLostReasonDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.opportunityLostReasonDetail.list(params),
    queryFn: () => apiGet<OpportunityLostReasonDetail[]>(`/opportunity-lost-reason-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Opportunity Lost Reason Detail by ID.
 */
export function useOpportunityLostReasonDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<OpportunityLostReasonDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.opportunityLostReasonDetail.detail(id ?? ''),
    queryFn: () => apiGet<OpportunityLostReasonDetail | null>(`/opportunity-lost-reason-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Opportunity Lost Reason Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateOpportunityLostReasonDetail(
  options?: UseMutationOptions<OpportunityLostReasonDetail, Error, Partial<OpportunityLostReasonDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<OpportunityLostReasonDetail>) => apiPost<OpportunityLostReasonDetail>('/opportunity-lost-reason-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityLostReasonDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Opportunity Lost Reason Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOpportunityLostReasonDetail(
  options?: UseMutationOptions<OpportunityLostReasonDetail, Error, { id: string; data: Partial<OpportunityLostReasonDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpportunityLostReasonDetail> }) =>
      apiPut<OpportunityLostReasonDetail>(`/opportunity-lost-reason-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityLostReasonDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityLostReasonDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Opportunity Lost Reason Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOpportunityLostReasonDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/opportunity-lost-reason-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityLostReasonDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
