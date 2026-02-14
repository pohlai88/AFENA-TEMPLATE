// TanStack Query hooks for Sales Partner
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesPartner } from '../types/sales-partner.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesPartnerListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Partner records.
 */
export function useSalesPartnerList(
  params: SalesPartnerListParams = {},
  options?: Omit<UseQueryOptions<SalesPartner[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesPartner.list(params),
    queryFn: () => apiGet<SalesPartner[]>(`/sales-partner${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Partner by ID.
 */
export function useSalesPartner(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesPartner | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesPartner.detail(id ?? ''),
    queryFn: () => apiGet<SalesPartner | null>(`/sales-partner/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Partner.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesPartner(
  options?: UseMutationOptions<SalesPartner, Error, Partial<SalesPartner>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesPartner>) => apiPost<SalesPartner>('/sales-partner', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartner.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Partner.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesPartner(
  options?: UseMutationOptions<SalesPartner, Error, { id: string; data: Partial<SalesPartner> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesPartner> }) =>
      apiPut<SalesPartner>(`/sales-partner/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartner.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartner.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Partner by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesPartner(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-partner/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartner.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
