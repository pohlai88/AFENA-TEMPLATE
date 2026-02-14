// TanStack Query hooks for Authorization Rule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AuthorizationRule } from '../types/authorization-rule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AuthorizationRuleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Authorization Rule records.
 */
export function useAuthorizationRuleList(
  params: AuthorizationRuleListParams = {},
  options?: Omit<UseQueryOptions<AuthorizationRule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.authorizationRule.list(params),
    queryFn: () => apiGet<AuthorizationRule[]>(`/authorization-rule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Authorization Rule by ID.
 */
export function useAuthorizationRule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AuthorizationRule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.authorizationRule.detail(id ?? ''),
    queryFn: () => apiGet<AuthorizationRule | null>(`/authorization-rule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Authorization Rule.
 * Automatically invalidates list queries on success.
 */
export function useCreateAuthorizationRule(
  options?: UseMutationOptions<AuthorizationRule, Error, Partial<AuthorizationRule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AuthorizationRule>) => apiPost<AuthorizationRule>('/authorization-rule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authorizationRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Authorization Rule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAuthorizationRule(
  options?: UseMutationOptions<AuthorizationRule, Error, { id: string; data: Partial<AuthorizationRule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AuthorizationRule> }) =>
      apiPut<AuthorizationRule>(`/authorization-rule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authorizationRule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.authorizationRule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Authorization Rule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAuthorizationRule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/authorization-rule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.authorizationRule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
