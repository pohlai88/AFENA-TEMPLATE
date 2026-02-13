// TanStack Query hooks for Bank Statement Import
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankStatementImport } from '../types/bank-statement-import.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankStatementImportListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Statement Import records.
 */
export function useBankStatementImportList(
  params: BankStatementImportListParams = {},
  options?: Omit<UseQueryOptions<BankStatementImport[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankStatementImport.list(params),
    queryFn: () => apiGet<BankStatementImport[]>(`/bank-statement-import${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Statement Import by ID.
 */
export function useBankStatementImport(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankStatementImport | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankStatementImport.detail(id ?? ''),
    queryFn: () => apiGet<BankStatementImport | null>(`/bank-statement-import/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Statement Import.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankStatementImport(
  options?: UseMutationOptions<BankStatementImport, Error, Partial<BankStatementImport>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankStatementImport>) => apiPost<BankStatementImport>('/bank-statement-import', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankStatementImport.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Statement Import.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankStatementImport(
  options?: UseMutationOptions<BankStatementImport, Error, { id: string; data: Partial<BankStatementImport> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankStatementImport> }) =>
      apiPut<BankStatementImport>(`/bank-statement-import/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankStatementImport.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankStatementImport.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Statement Import by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankStatementImport(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-statement-import/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankStatementImport.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
