// TanStack Query hooks for Opportunity Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { OpportunityType } from '../types/opportunity-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OpportunityTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Opportunity Type records.
 */
export function useOpportunityTypeList(
  params: OpportunityTypeListParams = {},
  options?: Omit<UseQueryOptions<OpportunityType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.opportunityType.list(params),
    queryFn: () => apiGet<OpportunityType[]>(`/opportunity-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Opportunity Type by ID.
 */
export function useOpportunityType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<OpportunityType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.opportunityType.detail(id ?? ''),
    queryFn: () => apiGet<OpportunityType | null>(`/opportunity-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Opportunity Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateOpportunityType(
  options?: UseMutationOptions<OpportunityType, Error, Partial<OpportunityType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<OpportunityType>) => apiPost<OpportunityType>('/opportunity-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Opportunity Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOpportunityType(
  options?: UseMutationOptions<OpportunityType, Error, { id: string; data: Partial<OpportunityType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpportunityType> }) =>
      apiPut<OpportunityType>(`/opportunity-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Opportunity Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOpportunityType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/opportunity-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.opportunityType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
