import { orgEntityTrashPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.contacts.trash.page',
  page: orgEntityTrashPage('contacts'),
  exposes: ['contacts.list', 'contacts.restore'],
} as const;
