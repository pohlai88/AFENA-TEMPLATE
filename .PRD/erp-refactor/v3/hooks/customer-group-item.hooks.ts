// TanStack Query hooks for Customer Group Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CustomerGroupItem } from '../types/customer-group-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CustomerGroupItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Customer Group Item records.
 */
export function useCustomerGroupItemList(
  params: CustomerGroupItemListParams = {},
  options?: Omit<UseQueryOptions<CustomerGroupItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.customerGroupItem.list(params),
    queryFn: () => apiGet<CustomerGroupItem[]>(`/customer-group-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Customer Group Item by ID.
 */
export function useCustomerGroupItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CustomerGroupItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.customerGroupItem.detail(id ?? ''),
    queryFn: () => apiGet<CustomerGroupItem | null>(`/customer-group-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Customer Group Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateCustomerGroupItem(
  options?: UseMutationOptions<CustomerGroupItem, Error, Partial<CustomerGroupItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CustomerGroupItem>) => apiPost<CustomerGroupItem>('/customer-group-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerGroupItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Customer Group Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCustomerGroupItem(
  options?: UseMutationOptions<CustomerGroupItem, Error, { id: string; data: Partial<CustomerGroupItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerGroupItem> }) =>
      apiPut<CustomerGroupItem>(`/customer-group-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerGroupItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customerGroupItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Customer Group Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCustomerGroupItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/customer-group-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerGroupItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
