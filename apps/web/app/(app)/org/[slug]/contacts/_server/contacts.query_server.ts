import { cache } from 'react';

import { getContacts, getContact, getDeletedContacts } from '@/app/actions/contacts';

import type { ContactRow } from '../_components/contact-columns';

/**
 * Contact query loaders — React.cache() wrapped for request deduplication.
 * Server-only: never import from client modules (INV-6).
 */

export const listContacts = cache(async (): Promise<ContactRow[]> => {
  const response = await getContacts({ limit: 100 });
  if (!response.ok) return [];
  return response.data as ContactRow[];
});

export const readContact = cache(async (id: string): Promise<ContactRow | null> => {
  const response = await getContact(id);
  if (!response.ok) return null;
  return response.data as ContactRow;
});

export const listTrashedContacts = cache(async (): Promise<ContactRow[]> => {
  const response = await getDeletedContacts({ limit: 100 });
  if (!response.ok) return [];
  return (response.data as ContactRow[]).filter((c) => c.is_deleted);
});
