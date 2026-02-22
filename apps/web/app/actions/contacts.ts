'use server';

import { generateEntityActions } from '@/lib/actions/entity-actions';

import type { ApiResponse } from 'afenda-canon';

// CAPABILITIES moved to contacts.capabilities.ts (Next.js 16: 'use server' files can only export async functions)

const actions = generateEntityActions('contacts');

// ── Create ──────────────────────────────────────────────────

export async function createContact(input: {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}): Promise<ApiResponse> {
  return actions.create(input);
}

// ── Update ──────────────────────────────────────────────────

export async function updateContact(
  id: string,
  expectedVersion: number,
  input: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    notes?: string;
  },
): Promise<ApiResponse> {
  return actions.update(id, expectedVersion, input);
}

// ── Delete (soft) ───────────────────────────────────────────

export async function deleteContact(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.remove(id, expectedVersion);
}

// ── Restore ─────────────────────────────────────────────────

export async function restoreContact(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.restore(id, expectedVersion);
}

// ── Submit (draft → submitted) ───────────────────────────────

export async function submitContact(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.submit(id, expectedVersion);
}

// ── Cancel (submitted/active → cancelled) ───────────────────

export async function cancelContact(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.cancel(id, expectedVersion);
}

// ── Approve (submitted → active) ────────────────────────────

export async function approveContact(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.approve(id, expectedVersion);
}

// ── Reject (submitted → draft) ──────────────────────────────

export async function rejectContact(
  id: string,
  expectedVersion: number,
): Promise<ApiResponse> {
  return actions.reject(id, expectedVersion);
}

// ── Read ────────────────────────────────────────────────────

export async function getContact(id: string): Promise<ApiResponse> {
  return actions.read(id);
}

export async function getContacts(options?: {
  includeDeleted?: boolean;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  return actions.list(options);
}

export async function getDeletedContacts(options?: {
  limit?: number;
  offset?: number;
}): Promise<ApiResponse> {
  return actions.list({ ...options, includeDeleted: true });
}

// ── Version History ─────────────────────────────────────────

export async function getContactVersions(contactId: string): Promise<ApiResponse> {
  return actions.getVersions(contactId);
}

// ── Audit Logs ──────────────────────────────────────────────

export async function getContactAuditLogs(contactId: string): Promise<ApiResponse> {
  return actions.getAuditLogs(contactId);
}
