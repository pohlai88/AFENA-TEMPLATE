// TanStack Query hooks for Prospect Opportunity
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProspectOpportunity } from '../types/prospect-opportunity.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProspectOpportunityListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Prospect Opportunity records.
 */
export function useProspectOpportunityList(
  params: ProspectOpportunityListParams = {},
  options?: Omit<UseQueryOptions<ProspectOpportunity[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.prospectOpportunity.list(params),
    queryFn: () => apiGet<ProspectOpportunity[]>(`/prospect-opportunity${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Prospect Opportunity by ID.
 */
export function useProspectOpportunity(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProspectOpportunity | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.prospectOpportunity.detail(id ?? ''),
    queryFn: () => apiGet<ProspectOpportunity | null>(`/prospect-opportunity/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Prospect Opportunity.
 * Automatically invalidates list queries on success.
 */
export function useCreateProspectOpportunity(
  options?: UseMutationOptions<ProspectOpportunity, Error, Partial<ProspectOpportunity>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProspectOpportunity>) => apiPost<ProspectOpportunity>('/prospect-opportunity', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospectOpportunity.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Prospect Opportunity.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProspectOpportunity(
  options?: UseMutationOptions<ProspectOpportunity, Error, { id: string; data: Partial<ProspectOpportunity> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProspectOpportunity> }) =>
      apiPut<ProspectOpportunity>(`/prospect-opportunity/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospectOpportunity.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.prospectOpportunity.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Prospect Opportunity by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProspectOpportunity(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/prospect-opportunity/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospectOpportunity.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
