// TanStack Query hooks for Repost Accounting Ledger Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RepostAccountingLedgerSettings } from '../types/repost-accounting-ledger-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RepostAccountingLedgerSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Repost Accounting Ledger Settings records.
 */
export function useRepostAccountingLedgerSettingsList(
  params: RepostAccountingLedgerSettingsListParams = {},
  options?: Omit<UseQueryOptions<RepostAccountingLedgerSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.repostAccountingLedgerSettings.list(params),
    queryFn: () => apiGet<RepostAccountingLedgerSettings[]>(`/repost-accounting-ledger-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Repost Accounting Ledger Settings by ID.
 */
export function useRepostAccountingLedgerSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RepostAccountingLedgerSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.repostAccountingLedgerSettings.detail(id ?? ''),
    queryFn: () => apiGet<RepostAccountingLedgerSettings | null>(`/repost-accounting-ledger-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Repost Accounting Ledger Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateRepostAccountingLedgerSettings(
  options?: UseMutationOptions<RepostAccountingLedgerSettings, Error, Partial<RepostAccountingLedgerSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RepostAccountingLedgerSettings>) => apiPost<RepostAccountingLedgerSettings>('/repost-accounting-ledger-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedgerSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Repost Accounting Ledger Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRepostAccountingLedgerSettings(
  options?: UseMutationOptions<RepostAccountingLedgerSettings, Error, { id: string; data: Partial<RepostAccountingLedgerSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepostAccountingLedgerSettings> }) =>
      apiPut<RepostAccountingLedgerSettings>(`/repost-accounting-ledger-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedgerSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedgerSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Repost Accounting Ledger Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRepostAccountingLedgerSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/repost-accounting-ledger-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedgerSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
