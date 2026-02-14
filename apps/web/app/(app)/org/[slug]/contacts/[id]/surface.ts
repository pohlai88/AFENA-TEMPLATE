import { orgEntityIdPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.contacts.detail.page',
  page: orgEntityIdPage('contacts'),
  exposes: ['contacts.read', 'contacts.delete'],
} as const;
