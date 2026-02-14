// TanStack Query hooks for Opening Invoice Creation Tool Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { OpeningInvoiceCreationToolItem } from '../types/opening-invoice-creation-tool-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OpeningInvoiceCreationToolItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Opening Invoice Creation Tool Item records.
 */
export function useOpeningInvoiceCreationToolItemList(
  params: OpeningInvoiceCreationToolItemListParams = {},
  options?: Omit<UseQueryOptions<OpeningInvoiceCreationToolItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.openingInvoiceCreationToolItem.list(params),
    queryFn: () => apiGet<OpeningInvoiceCreationToolItem[]>(`/opening-invoice-creation-tool-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Opening Invoice Creation Tool Item by ID.
 */
export function useOpeningInvoiceCreationToolItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<OpeningInvoiceCreationToolItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.openingInvoiceCreationToolItem.detail(id ?? ''),
    queryFn: () => apiGet<OpeningInvoiceCreationToolItem | null>(`/opening-invoice-creation-tool-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Opening Invoice Creation Tool Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateOpeningInvoiceCreationToolItem(
  options?: UseMutationOptions<OpeningInvoiceCreationToolItem, Error, Partial<OpeningInvoiceCreationToolItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<OpeningInvoiceCreationToolItem>) => apiPost<OpeningInvoiceCreationToolItem>('/opening-invoice-creation-tool-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openingInvoiceCreationToolItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Opening Invoice Creation Tool Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOpeningInvoiceCreationToolItem(
  options?: UseMutationOptions<OpeningInvoiceCreationToolItem, Error, { id: string; data: Partial<OpeningInvoiceCreationToolItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OpeningInvoiceCreationToolItem> }) =>
      apiPut<OpeningInvoiceCreationToolItem>(`/opening-invoice-creation-tool-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openingInvoiceCreationToolItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.openingInvoiceCreationToolItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Opening Invoice Creation Tool Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOpeningInvoiceCreationToolItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/opening-invoice-creation-tool-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.openingInvoiceCreationToolItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
