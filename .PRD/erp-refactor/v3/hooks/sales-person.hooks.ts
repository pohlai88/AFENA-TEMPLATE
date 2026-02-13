// TanStack Query hooks for Sales Person
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesPerson } from '../types/sales-person.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesPersonListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Person records.
 */
export function useSalesPersonList(
  params: SalesPersonListParams = {},
  options?: Omit<UseQueryOptions<SalesPerson[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesPerson.list(params),
    queryFn: () => apiGet<SalesPerson[]>(`/sales-person${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Person by ID.
 */
export function useSalesPerson(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesPerson | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesPerson.detail(id ?? ''),
    queryFn: () => apiGet<SalesPerson | null>(`/sales-person/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Person.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesPerson(
  options?: UseMutationOptions<SalesPerson, Error, Partial<SalesPerson>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesPerson>) => apiPost<SalesPerson>('/sales-person', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPerson.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Person.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesPerson(
  options?: UseMutationOptions<SalesPerson, Error, { id: string; data: Partial<SalesPerson> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesPerson> }) =>
      apiPut<SalesPerson>(`/sales-person/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPerson.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPerson.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Person by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesPerson(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-person/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesPerson.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
