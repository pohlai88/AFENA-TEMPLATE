// TanStack Query hooks for Customer Number At Supplier
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CustomerNumberAtSupplier } from '../types/customer-number-at-supplier.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CustomerNumberAtSupplierListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Customer Number At Supplier records.
 */
export function useCustomerNumberAtSupplierList(
  params: CustomerNumberAtSupplierListParams = {},
  options?: Omit<UseQueryOptions<CustomerNumberAtSupplier[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.customerNumberAtSupplier.list(params),
    queryFn: () => apiGet<CustomerNumberAtSupplier[]>(`/customer-number-at-supplier${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Customer Number At Supplier by ID.
 */
export function useCustomerNumberAtSupplier(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CustomerNumberAtSupplier | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.customerNumberAtSupplier.detail(id ?? ''),
    queryFn: () => apiGet<CustomerNumberAtSupplier | null>(`/customer-number-at-supplier/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Customer Number At Supplier.
 * Automatically invalidates list queries on success.
 */
export function useCreateCustomerNumberAtSupplier(
  options?: UseMutationOptions<CustomerNumberAtSupplier, Error, Partial<CustomerNumberAtSupplier>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CustomerNumberAtSupplier>) => apiPost<CustomerNumberAtSupplier>('/customer-number-at-supplier', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerNumberAtSupplier.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Customer Number At Supplier.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCustomerNumberAtSupplier(
  options?: UseMutationOptions<CustomerNumberAtSupplier, Error, { id: string; data: Partial<CustomerNumberAtSupplier> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerNumberAtSupplier> }) =>
      apiPut<CustomerNumberAtSupplier>(`/customer-number-at-supplier/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerNumberAtSupplier.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customerNumberAtSupplier.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Customer Number At Supplier by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCustomerNumberAtSupplier(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/customer-number-at-supplier/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerNumberAtSupplier.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
