// TanStack Query hooks for Finance Book
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { FinanceBook } from '../types/finance-book.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface FinanceBookListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Finance Book records.
 */
export function useFinanceBookList(
  params: FinanceBookListParams = {},
  options?: Omit<UseQueryOptions<FinanceBook[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.financeBook.list(params),
    queryFn: () => apiGet<FinanceBook[]>(`/finance-book${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Finance Book by ID.
 */
export function useFinanceBook(
  id: string | undefined,
  options?: Omit<UseQueryOptions<FinanceBook | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.financeBook.detail(id ?? ''),
    queryFn: () => apiGet<FinanceBook | null>(`/finance-book/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Finance Book.
 * Automatically invalidates list queries on success.
 */
export function useCreateFinanceBook(
  options?: UseMutationOptions<FinanceBook, Error, Partial<FinanceBook>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FinanceBook>) => apiPost<FinanceBook>('/finance-book', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financeBook.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Finance Book.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateFinanceBook(
  options?: UseMutationOptions<FinanceBook, Error, { id: string; data: Partial<FinanceBook> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FinanceBook> }) =>
      apiPut<FinanceBook>(`/finance-book/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financeBook.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.financeBook.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Finance Book by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteFinanceBook(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/finance-book/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financeBook.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
