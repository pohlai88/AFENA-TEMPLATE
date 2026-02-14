// TanStack Query hooks for Customer Credit Limit
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CustomerCreditLimit } from '../types/customer-credit-limit.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CustomerCreditLimitListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Customer Credit Limit records.
 */
export function useCustomerCreditLimitList(
  params: CustomerCreditLimitListParams = {},
  options?: Omit<UseQueryOptions<CustomerCreditLimit[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.customerCreditLimit.list(params),
    queryFn: () => apiGet<CustomerCreditLimit[]>(`/customer-credit-limit${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Customer Credit Limit by ID.
 */
export function useCustomerCreditLimit(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CustomerCreditLimit | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.customerCreditLimit.detail(id ?? ''),
    queryFn: () => apiGet<CustomerCreditLimit | null>(`/customer-credit-limit/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Customer Credit Limit.
 * Automatically invalidates list queries on success.
 */
export function useCreateCustomerCreditLimit(
  options?: UseMutationOptions<CustomerCreditLimit, Error, Partial<CustomerCreditLimit>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CustomerCreditLimit>) => apiPost<CustomerCreditLimit>('/customer-credit-limit', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerCreditLimit.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Customer Credit Limit.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCustomerCreditLimit(
  options?: UseMutationOptions<CustomerCreditLimit, Error, { id: string; data: Partial<CustomerCreditLimit> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerCreditLimit> }) =>
      apiPut<CustomerCreditLimit>(`/customer-credit-limit/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerCreditLimit.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customerCreditLimit.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Customer Credit Limit by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCustomerCreditLimit(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/customer-credit-limit/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerCreditLimit.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
