// TanStack Query hooks for Supplier Number At Customer
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierNumberAtCustomer } from '../types/supplier-number-at-customer.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierNumberAtCustomerListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Number At Customer records.
 */
export function useSupplierNumberAtCustomerList(
  params: SupplierNumberAtCustomerListParams = {},
  options?: Omit<UseQueryOptions<SupplierNumberAtCustomer[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierNumberAtCustomer.list(params),
    queryFn: () => apiGet<SupplierNumberAtCustomer[]>(`/supplier-number-at-customer${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Number At Customer by ID.
 */
export function useSupplierNumberAtCustomer(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierNumberAtCustomer | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierNumberAtCustomer.detail(id ?? ''),
    queryFn: () => apiGet<SupplierNumberAtCustomer | null>(`/supplier-number-at-customer/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Number At Customer.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierNumberAtCustomer(
  options?: UseMutationOptions<SupplierNumberAtCustomer, Error, Partial<SupplierNumberAtCustomer>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierNumberAtCustomer>) => apiPost<SupplierNumberAtCustomer>('/supplier-number-at-customer', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierNumberAtCustomer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Number At Customer.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierNumberAtCustomer(
  options?: UseMutationOptions<SupplierNumberAtCustomer, Error, { id: string; data: Partial<SupplierNumberAtCustomer> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierNumberAtCustomer> }) =>
      apiPut<SupplierNumberAtCustomer>(`/supplier-number-at-customer/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierNumberAtCustomer.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierNumberAtCustomer.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Number At Customer by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierNumberAtCustomer(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-number-at-customer/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierNumberAtCustomer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
