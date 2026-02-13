// TanStack Query hooks for Bisect Accounting Statements
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BisectAccountingStatements } from '../types/bisect-accounting-statements.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BisectAccountingStatementsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bisect Accounting Statements records.
 */
export function useBisectAccountingStatementsList(
  params: BisectAccountingStatementsListParams = {},
  options?: Omit<UseQueryOptions<BisectAccountingStatements[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bisectAccountingStatements.list(params),
    queryFn: () => apiGet<BisectAccountingStatements[]>(`/bisect-accounting-statements${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bisect Accounting Statements by ID.
 */
export function useBisectAccountingStatements(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BisectAccountingStatements | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bisectAccountingStatements.detail(id ?? ''),
    queryFn: () => apiGet<BisectAccountingStatements | null>(`/bisect-accounting-statements/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bisect Accounting Statements.
 * Automatically invalidates list queries on success.
 */
export function useCreateBisectAccountingStatements(
  options?: UseMutationOptions<BisectAccountingStatements, Error, Partial<BisectAccountingStatements>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BisectAccountingStatements>) => apiPost<BisectAccountingStatements>('/bisect-accounting-statements', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bisectAccountingStatements.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bisect Accounting Statements.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBisectAccountingStatements(
  options?: UseMutationOptions<BisectAccountingStatements, Error, { id: string; data: Partial<BisectAccountingStatements> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BisectAccountingStatements> }) =>
      apiPut<BisectAccountingStatements>(`/bisect-accounting-statements/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bisectAccountingStatements.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bisectAccountingStatements.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bisect Accounting Statements by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBisectAccountingStatements(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bisect-accounting-statements/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bisectAccountingStatements.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
