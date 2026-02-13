// TanStack Query hooks for Terms and Conditions
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TermsAndConditions } from '../types/terms-and-conditions.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TermsAndConditionsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Terms and Conditions records.
 */
export function useTermsAndConditionsList(
  params: TermsAndConditionsListParams = {},
  options?: Omit<UseQueryOptions<TermsAndConditions[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.termsAndConditions.list(params),
    queryFn: () => apiGet<TermsAndConditions[]>(`/terms-and-conditions${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Terms and Conditions by ID.
 */
export function useTermsAndConditions(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TermsAndConditions | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.termsAndConditions.detail(id ?? ''),
    queryFn: () => apiGet<TermsAndConditions | null>(`/terms-and-conditions/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Terms and Conditions.
 * Automatically invalidates list queries on success.
 */
export function useCreateTermsAndConditions(
  options?: UseMutationOptions<TermsAndConditions, Error, Partial<TermsAndConditions>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TermsAndConditions>) => apiPost<TermsAndConditions>('/terms-and-conditions', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termsAndConditions.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Terms and Conditions.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTermsAndConditions(
  options?: UseMutationOptions<TermsAndConditions, Error, { id: string; data: Partial<TermsAndConditions> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TermsAndConditions> }) =>
      apiPut<TermsAndConditions>(`/terms-and-conditions/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termsAndConditions.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.termsAndConditions.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Terms and Conditions by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTermsAndConditions(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/terms-and-conditions/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.termsAndConditions.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
