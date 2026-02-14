// TanStack Query hooks for Request for Quotation Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RequestForQuotationItem } from '../types/request-for-quotation-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RequestForQuotationItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Request for Quotation Item records.
 */
export function useRequestForQuotationItemList(
  params: RequestForQuotationItemListParams = {},
  options?: Omit<UseQueryOptions<RequestForQuotationItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.requestForQuotationItem.list(params),
    queryFn: () => apiGet<RequestForQuotationItem[]>(`/request-for-quotation-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Request for Quotation Item by ID.
 */
export function useRequestForQuotationItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RequestForQuotationItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.requestForQuotationItem.detail(id ?? ''),
    queryFn: () => apiGet<RequestForQuotationItem | null>(`/request-for-quotation-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Request for Quotation Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateRequestForQuotationItem(
  options?: UseMutationOptions<RequestForQuotationItem, Error, Partial<RequestForQuotationItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RequestForQuotationItem>) => apiPost<RequestForQuotationItem>('/request-for-quotation-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotationItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Request for Quotation Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRequestForQuotationItem(
  options?: UseMutationOptions<RequestForQuotationItem, Error, { id: string; data: Partial<RequestForQuotationItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RequestForQuotationItem> }) =>
      apiPut<RequestForQuotationItem>(`/request-for-quotation-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotationItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotationItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Request for Quotation Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRequestForQuotationItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/request-for-quotation-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotationItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
