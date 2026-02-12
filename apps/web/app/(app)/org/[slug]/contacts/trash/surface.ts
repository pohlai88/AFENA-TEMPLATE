export const SURFACE = {
  surfaceId: 'web.contacts.trash.page',
  page: '/org/[slug]/contacts/trash',
  exposes: ['contacts.list', 'contacts.restore'],
} as const;
