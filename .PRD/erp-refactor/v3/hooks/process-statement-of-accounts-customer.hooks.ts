// TanStack Query hooks for Process Statement Of Accounts Customer
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessStatementOfAccountsCustomer } from '../types/process-statement-of-accounts-customer.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessStatementOfAccountsCustomerListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Statement Of Accounts Customer records.
 */
export function useProcessStatementOfAccountsCustomerList(
  params: ProcessStatementOfAccountsCustomerListParams = {},
  options?: Omit<UseQueryOptions<ProcessStatementOfAccountsCustomer[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processStatementOfAccountsCustomer.list(params),
    queryFn: () => apiGet<ProcessStatementOfAccountsCustomer[]>(`/process-statement-of-accounts-customer${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Statement Of Accounts Customer by ID.
 */
export function useProcessStatementOfAccountsCustomer(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessStatementOfAccountsCustomer | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processStatementOfAccountsCustomer.detail(id ?? ''),
    queryFn: () => apiGet<ProcessStatementOfAccountsCustomer | null>(`/process-statement-of-accounts-customer/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Statement Of Accounts Customer.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessStatementOfAccountsCustomer(
  options?: UseMutationOptions<ProcessStatementOfAccountsCustomer, Error, Partial<ProcessStatementOfAccountsCustomer>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessStatementOfAccountsCustomer>) => apiPost<ProcessStatementOfAccountsCustomer>('/process-statement-of-accounts-customer', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccountsCustomer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Statement Of Accounts Customer.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessStatementOfAccountsCustomer(
  options?: UseMutationOptions<ProcessStatementOfAccountsCustomer, Error, { id: string; data: Partial<ProcessStatementOfAccountsCustomer> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessStatementOfAccountsCustomer> }) =>
      apiPut<ProcessStatementOfAccountsCustomer>(`/process-statement-of-accounts-customer/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccountsCustomer.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccountsCustomer.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Statement Of Accounts Customer by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessStatementOfAccountsCustomer(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-statement-of-accounts-customer/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccountsCustomer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
