import { orgEntityVersionsPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.contacts.versions.page',
  page: orgEntityVersionsPage('contacts'),
  exposes: ['contacts.versions'],
} as const;
