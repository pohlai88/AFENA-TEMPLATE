import { auth } from '@/lib/auth/server';

export const CAPABILITIES = ['auth.sign_in', 'auth.sign_out'] as const;

export const { GET, POST } = auth.handler();
