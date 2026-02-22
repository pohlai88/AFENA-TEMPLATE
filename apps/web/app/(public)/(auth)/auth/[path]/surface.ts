export const SURFACE = {
  surfaceId: 'web.auth.page',
  page: '/auth/[path]',
  exposes: ['auth.sign_in', 'auth.sign_out'],
} as const;
