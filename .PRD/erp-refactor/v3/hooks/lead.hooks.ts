// TanStack Query hooks for Lead
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Lead } from '../types/lead.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LeadListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Lead records.
 */
export function useLeadList(
  params: LeadListParams = {},
  options?: Omit<UseQueryOptions<Lead[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.lead.list(params),
    queryFn: () => apiGet<Lead[]>(`/lead${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Lead by ID.
 */
export function useLead(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Lead | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.lead.detail(id ?? ''),
    queryFn: () => apiGet<Lead | null>(`/lead/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Lead.
 * Automatically invalidates list queries on success.
 */
export function useCreateLead(
  options?: UseMutationOptions<Lead, Error, Partial<Lead>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Lead>) => apiPost<Lead>('/lead', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lead.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Lead.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLead(
  options?: UseMutationOptions<Lead, Error, { id: string; data: Partial<Lead> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Lead> }) =>
      apiPut<Lead>(`/lead/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lead.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.lead.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Lead by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLead(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/lead/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lead.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
