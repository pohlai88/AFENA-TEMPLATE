// TanStack Query hooks for Quotation Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QuotationItem } from '../types/quotation-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QuotationItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quotation Item records.
 */
export function useQuotationItemList(
  params: QuotationItemListParams = {},
  options?: Omit<UseQueryOptions<QuotationItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.quotationItem.list(params),
    queryFn: () => apiGet<QuotationItem[]>(`/quotation-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quotation Item by ID.
 */
export function useQuotationItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QuotationItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.quotationItem.detail(id ?? ''),
    queryFn: () => apiGet<QuotationItem | null>(`/quotation-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quotation Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateQuotationItem(
  options?: UseMutationOptions<QuotationItem, Error, Partial<QuotationItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QuotationItem>) => apiPost<QuotationItem>('/quotation-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quotation Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQuotationItem(
  options?: UseMutationOptions<QuotationItem, Error, { id: string; data: Partial<QuotationItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuotationItem> }) =>
      apiPut<QuotationItem>(`/quotation-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quotation Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQuotationItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quotation-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
