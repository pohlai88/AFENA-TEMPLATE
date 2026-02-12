'use server';

import { generateEntityActions } from '@/lib/actions/entity-actions';

import type { ApiResponse } from 'afena-canon';

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
