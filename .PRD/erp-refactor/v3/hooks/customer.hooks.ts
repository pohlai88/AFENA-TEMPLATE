// TanStack Query hooks for Customer
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Customer } from '../types/customer.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CustomerListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Customer records.
 */
export function useCustomerList(
  params: CustomerListParams = {},
  options?: Omit<UseQueryOptions<Customer[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.customer.list(params),
    queryFn: () => apiGet<Customer[]>(`/customer${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Customer by ID.
 */
export function useCustomer(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Customer | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.customer.detail(id ?? ''),
    queryFn: () => apiGet<Customer | null>(`/customer/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Customer.
 * Automatically invalidates list queries on success.
 */
export function useCreateCustomer(
  options?: UseMutationOptions<Customer, Error, Partial<Customer>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Customer>) => apiPost<Customer>('/customer', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Customer.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCustomer(
  options?: UseMutationOptions<Customer, Error, { id: string; data: Partial<Customer> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      apiPut<Customer>(`/customer/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Customer by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCustomer(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/customer/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
