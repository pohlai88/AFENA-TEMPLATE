// TanStack Query hooks for Bank Reconciliation Tool
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankReconciliationTool } from '../types/bank-reconciliation-tool.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankReconciliationToolListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Reconciliation Tool records.
 */
export function useBankReconciliationToolList(
  params: BankReconciliationToolListParams = {},
  options?: Omit<UseQueryOptions<BankReconciliationTool[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankReconciliationTool.list(params),
    queryFn: () => apiGet<BankReconciliationTool[]>(`/bank-reconciliation-tool${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Reconciliation Tool by ID.
 */
export function useBankReconciliationTool(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankReconciliationTool | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankReconciliationTool.detail(id ?? ''),
    queryFn: () => apiGet<BankReconciliationTool | null>(`/bank-reconciliation-tool/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Reconciliation Tool.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankReconciliationTool(
  options?: UseMutationOptions<BankReconciliationTool, Error, Partial<BankReconciliationTool>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankReconciliationTool>) => apiPost<BankReconciliationTool>('/bank-reconciliation-tool', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankReconciliationTool.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Reconciliation Tool.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankReconciliationTool(
  options?: UseMutationOptions<BankReconciliationTool, Error, { id: string; data: Partial<BankReconciliationTool> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankReconciliationTool> }) =>
      apiPut<BankReconciliationTool>(`/bank-reconciliation-tool/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankReconciliationTool.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankReconciliationTool.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Reconciliation Tool by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankReconciliationTool(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-reconciliation-tool/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankReconciliationTool.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
