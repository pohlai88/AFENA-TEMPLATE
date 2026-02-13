// TanStack Query hooks for Process Statement Of Accounts
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProcessStatementOfAccounts } from '../types/process-statement-of-accounts.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProcessStatementOfAccountsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Process Statement Of Accounts records.
 */
export function useProcessStatementOfAccountsList(
  params: ProcessStatementOfAccountsListParams = {},
  options?: Omit<UseQueryOptions<ProcessStatementOfAccounts[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.processStatementOfAccounts.list(params),
    queryFn: () => apiGet<ProcessStatementOfAccounts[]>(`/process-statement-of-accounts${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Process Statement Of Accounts by ID.
 */
export function useProcessStatementOfAccounts(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProcessStatementOfAccounts | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.processStatementOfAccounts.detail(id ?? ''),
    queryFn: () => apiGet<ProcessStatementOfAccounts | null>(`/process-statement-of-accounts/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Process Statement Of Accounts.
 * Automatically invalidates list queries on success.
 */
export function useCreateProcessStatementOfAccounts(
  options?: UseMutationOptions<ProcessStatementOfAccounts, Error, Partial<ProcessStatementOfAccounts>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProcessStatementOfAccounts>) => apiPost<ProcessStatementOfAccounts>('/process-statement-of-accounts', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccounts.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Process Statement Of Accounts.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProcessStatementOfAccounts(
  options?: UseMutationOptions<ProcessStatementOfAccounts, Error, { id: string; data: Partial<ProcessStatementOfAccounts> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProcessStatementOfAccounts> }) =>
      apiPut<ProcessStatementOfAccounts>(`/process-statement-of-accounts/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccounts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccounts.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Process Statement Of Accounts by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProcessStatementOfAccounts(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/process-statement-of-accounts/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processStatementOfAccounts.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
