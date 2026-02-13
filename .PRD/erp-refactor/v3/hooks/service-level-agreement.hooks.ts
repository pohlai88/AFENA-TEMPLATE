// TanStack Query hooks for Service Level Agreement
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ServiceLevelAgreement } from '../types/service-level-agreement.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ServiceLevelAgreementListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Service Level Agreement records.
 */
export function useServiceLevelAgreementList(
  params: ServiceLevelAgreementListParams = {},
  options?: Omit<UseQueryOptions<ServiceLevelAgreement[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.serviceLevelAgreement.list(params),
    queryFn: () => apiGet<ServiceLevelAgreement[]>(`/service-level-agreement${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Service Level Agreement by ID.
 */
export function useServiceLevelAgreement(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ServiceLevelAgreement | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.serviceLevelAgreement.detail(id ?? ''),
    queryFn: () => apiGet<ServiceLevelAgreement | null>(`/service-level-agreement/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Service Level Agreement.
 * Automatically invalidates list queries on success.
 */
export function useCreateServiceLevelAgreement(
  options?: UseMutationOptions<ServiceLevelAgreement, Error, Partial<ServiceLevelAgreement>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ServiceLevelAgreement>) => apiPost<ServiceLevelAgreement>('/service-level-agreement', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLevelAgreement.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Service Level Agreement.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateServiceLevelAgreement(
  options?: UseMutationOptions<ServiceLevelAgreement, Error, { id: string; data: Partial<ServiceLevelAgreement> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceLevelAgreement> }) =>
      apiPut<ServiceLevelAgreement>(`/service-level-agreement/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLevelAgreement.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLevelAgreement.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Service Level Agreement by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteServiceLevelAgreement(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/service-level-agreement/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLevelAgreement.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
