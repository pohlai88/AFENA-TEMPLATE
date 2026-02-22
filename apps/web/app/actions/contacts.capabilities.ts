/**
 * Capability keys for contacts server actions.
 * Separated from contacts.ts because Next.js 16 'use server' files
 * can only export async functions.
 */
export const CAPABILITIES = [
  'contacts.create',
  'contacts.update',
  'contacts.delete',
  'contacts.restore',
  'contacts.read',
  'contacts.list',
  'contacts.versions',
  'contacts.audit',
] as const;
