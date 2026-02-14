// TanStack Query hooks for Prospect Lead
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProspectLead } from '../types/prospect-lead.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProspectLeadListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Prospect Lead records.
 */
export function useProspectLeadList(
  params: ProspectLeadListParams = {},
  options?: Omit<UseQueryOptions<ProspectLead[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.prospectLead.list(params),
    queryFn: () => apiGet<ProspectLead[]>(`/prospect-lead${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Prospect Lead by ID.
 */
export function useProspectLead(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProspectLead | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.prospectLead.detail(id ?? ''),
    queryFn: () => apiGet<ProspectLead | null>(`/prospect-lead/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Prospect Lead.
 * Automatically invalidates list queries on success.
 */
export function useCreateProspectLead(
  options?: UseMutationOptions<ProspectLead, Error, Partial<ProspectLead>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProspectLead>) => apiPost<ProspectLead>('/prospect-lead', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospectLead.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Prospect Lead.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProspectLead(
  options?: UseMutationOptions<ProspectLead, Error, { id: string; data: Partial<ProspectLead> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProspectLead> }) =>
      apiPut<ProspectLead>(`/prospect-lead/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospectLead.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.prospectLead.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Prospect Lead by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProspectLead(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/prospect-lead/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.prospectLead.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
