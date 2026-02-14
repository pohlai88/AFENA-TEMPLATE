import { orgEntityPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.contacts.list.page',
  page: orgEntityPage('contacts'),
  exposes: ['contacts.list', 'contacts.create', 'contacts.delete'],
} as const;
