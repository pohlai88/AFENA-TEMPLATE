import { orgEntityEditPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.contacts.edit.page',
  page: orgEntityEditPage('contacts'),
  exposes: ['contacts.update'],
} as const;
