import { createClient } from '@neondatabase/neon-js';

import type { Database } from '@/types/database';

const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;
const dataApiUrl = process.env.NEON_DATA_API_URL;

if (!authUrl) throw new Error('NEXT_PUBLIC_NEON_AUTH_URL is not set');
if (!dataApiUrl) throw new Error('NEON_DATA_API_URL is not set');

export const neon = createClient<Database>({
  auth: { url: authUrl },
  dataApi: { url: dataApiUrl },
});

export default neon;
