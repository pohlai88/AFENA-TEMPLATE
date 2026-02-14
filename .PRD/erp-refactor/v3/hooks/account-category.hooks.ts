// TanStack Query hooks for Account Category
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AccountCategory } from '../types/account-category.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AccountCategoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Account Category records.
 */
export function useAccountCategoryList(
  params: AccountCategoryListParams = {},
  options?: Omit<UseQueryOptions<AccountCategory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.accountCategory.list(params),
    queryFn: () => apiGet<AccountCategory[]>(`/account-category${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Account Category by ID.
 */
export function useAccountCategory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AccountCategory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.accountCategory.detail(id ?? ''),
    queryFn: () => apiGet<AccountCategory | null>(`/account-category/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Account Category.
 * Automatically invalidates list queries on success.
 */
export function useCreateAccountCategory(
  options?: UseMutationOptions<AccountCategory, Error, Partial<AccountCategory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AccountCategory>) => apiPost<AccountCategory>('/account-category', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Account Category.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAccountCategory(
  options?: UseMutationOptions<AccountCategory, Error, { id: string; data: Partial<AccountCategory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccountCategory> }) =>
      apiPut<AccountCategory>(`/account-category/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountCategory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountCategory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Account Category by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAccountCategory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/account-category/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
