// TanStack Query hooks for Closed Document
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ClosedDocument } from '../types/closed-document.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ClosedDocumentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Closed Document records.
 */
export function useClosedDocumentList(
  params: ClosedDocumentListParams = {},
  options?: Omit<UseQueryOptions<ClosedDocument[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.closedDocument.list(params),
    queryFn: () => apiGet<ClosedDocument[]>(`/closed-document${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Closed Document by ID.
 */
export function useClosedDocument(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ClosedDocument | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.closedDocument.detail(id ?? ''),
    queryFn: () => apiGet<ClosedDocument | null>(`/closed-document/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Closed Document.
 * Automatically invalidates list queries on success.
 */
export function useCreateClosedDocument(
  options?: UseMutationOptions<ClosedDocument, Error, Partial<ClosedDocument>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ClosedDocument>) => apiPost<ClosedDocument>('/closed-document', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.closedDocument.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Closed Document.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateClosedDocument(
  options?: UseMutationOptions<ClosedDocument, Error, { id: string; data: Partial<ClosedDocument> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ClosedDocument> }) =>
      apiPut<ClosedDocument>(`/closed-document/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.closedDocument.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.closedDocument.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Closed Document by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteClosedDocument(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/closed-document/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.closedDocument.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
