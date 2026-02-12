export const SURFACE = {
  surfaceId: 'web.contacts.detail.page',
  page: '/org/[slug]/contacts/[id]',
  exposes: ['contacts.read', 'contacts.delete'],
} as const;
