// TanStack Query hooks for Putaway Rule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PutawayRule } from '../types/putaway-rule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PutawayRuleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Putaway Rule records.
 */
export function usePutawayRuleList(
  params: PutawayRuleListParams = {},
  options?: Omit<UseQueryOptions<PutawayRule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.putawayRule.list(params),
    queryFn: () => apiGet<PutawayRule[]>(`/putaway-rule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Putaway Rule by ID.
 */
export function usePutawayRule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PutawayRule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.putawayRule.detail(id ?? ''),
    queryFn: () => apiGet<PutawayRule | null>(`/putaway-rule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Putaway Rule.
 * Automatically invalidates list queries on success.
 */
export function useCreatePutawayRule(
  options?: UseMutationOptions<PutawayRule, Error, Partial<PutawayRule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PutawayRule>) => apiPost<PutawayRule>('/putaway-rule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.putawayRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Putaway Rule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePutawayRule(
  options?: UseMutationOptions<PutawayRule, Error, { id: string; data: Partial<PutawayRule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PutawayRule> }) =>
      apiPut<PutawayRule>(`/putaway-rule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.putawayRule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.putawayRule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Putaway Rule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePutawayRule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/putaway-rule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.putawayRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
