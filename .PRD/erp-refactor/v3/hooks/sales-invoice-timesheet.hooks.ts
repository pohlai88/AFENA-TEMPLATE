// TanStack Query hooks for Sales Invoice Timesheet
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SalesInvoiceTimesheet } from '../types/sales-invoice-timesheet.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SalesInvoiceTimesheetListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sales Invoice Timesheet records.
 */
export function useSalesInvoiceTimesheetList(
  params: SalesInvoiceTimesheetListParams = {},
  options?: Omit<UseQueryOptions<SalesInvoiceTimesheet[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.salesInvoiceTimesheet.list(params),
    queryFn: () => apiGet<SalesInvoiceTimesheet[]>(`/sales-invoice-timesheet${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sales Invoice Timesheet by ID.
 */
export function useSalesInvoiceTimesheet(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SalesInvoiceTimesheet | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.salesInvoiceTimesheet.detail(id ?? ''),
    queryFn: () => apiGet<SalesInvoiceTimesheet | null>(`/sales-invoice-timesheet/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sales Invoice Timesheet.
 * Automatically invalidates list queries on success.
 */
export function useCreateSalesInvoiceTimesheet(
  options?: UseMutationOptions<SalesInvoiceTimesheet, Error, Partial<SalesInvoiceTimesheet>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SalesInvoiceTimesheet>) => apiPost<SalesInvoiceTimesheet>('/sales-invoice-timesheet', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceTimesheet.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sales Invoice Timesheet.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSalesInvoiceTimesheet(
  options?: UseMutationOptions<SalesInvoiceTimesheet, Error, { id: string; data: Partial<SalesInvoiceTimesheet> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SalesInvoiceTimesheet> }) =>
      apiPut<SalesInvoiceTimesheet>(`/sales-invoice-timesheet/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceTimesheet.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceTimesheet.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sales Invoice Timesheet by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSalesInvoiceTimesheet(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sales-invoice-timesheet/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.salesInvoiceTimesheet.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
