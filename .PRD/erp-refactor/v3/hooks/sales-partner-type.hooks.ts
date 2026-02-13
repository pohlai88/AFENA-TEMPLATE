// TanStack Query hooks for Sales Partner Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesPartnerType } from '../types/sales-partner-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesPartnerTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Partner Type records.
 */
export function useSalesPartnerTypeList(
  params: SalesPartnerTypeListParams = {},
  options?: Omit<UseQueryOptions<SalesPartnerType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesPartnerType.list(params),
    queryFn: () => apiGet<SalesPartnerType[]>(`/sales-partner-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Partner Type by ID.
 */
export function useSalesPartnerType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesPartnerType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesPartnerType.detail(id ?? ''),
    queryFn: () => apiGet<SalesPartnerType | null>(`/sales-partner-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Partner Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesPartnerType(
  options?: UseMutationOptions<SalesPartnerType, Error, Partial<SalesPartnerType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesPartnerType>) => apiPost<SalesPartnerType>('/sales-partner-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartnerType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Partner Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesPartnerType(
  options?: UseMutationOptions<SalesPartnerType, Error, { id: string; data: Partial<SalesPartnerType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesPartnerType> }) =>
      apiPut<SalesPartnerType>(`/sales-partner-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartnerType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartnerType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Partner Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesPartnerType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-partner-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPartnerType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
