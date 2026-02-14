import { orgEntityNewPage } from '@/lib/routes/app-routes';

export const SURFACE = {
  surfaceId: 'web.contacts.new.page',
  page: orgEntityNewPage('contacts'),
  exposes: ['contacts.create'],
} as const;
