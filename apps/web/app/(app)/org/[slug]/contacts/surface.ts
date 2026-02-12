export const SURFACE = {
  surfaceId: 'web.contacts.list.page',
  page: '/org/[slug]/contacts',
  exposes: ['contacts.list', 'contacts.create', 'contacts.delete'],
} as const;
