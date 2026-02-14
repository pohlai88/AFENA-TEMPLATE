// TanStack Query hooks for Customer Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CustomerItem } from '../types/customer-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CustomerItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Customer Item records.
 */
export function useCustomerItemList(
  params: CustomerItemListParams = {},
  options?: Omit<UseQueryOptions<CustomerItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.customerItem.list(params),
    queryFn: () => apiGet<CustomerItem[]>(`/customer-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Customer Item by ID.
 */
export function useCustomerItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CustomerItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.customerItem.detail(id ?? ''),
    queryFn: () => apiGet<CustomerItem | null>(`/customer-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Customer Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateCustomerItem(
  options?: UseMutationOptions<CustomerItem, Error, Partial<CustomerItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CustomerItem>) => apiPost<CustomerItem>('/customer-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Customer Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCustomerItem(
  options?: UseMutationOptions<CustomerItem, Error, { id: string; data: Partial<CustomerItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerItem> }) =>
      apiPut<CustomerItem>(`/customer-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customerItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Customer Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCustomerItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/customer-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
