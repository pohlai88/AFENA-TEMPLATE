import { z } from 'zod';

export const SITE_TYPES = ['warehouse', 'branch', 'plant', 'office'] as const;
export type SiteType = (typeof SITE_TYPES)[number];
export const siteTypeSchema = z.enum(SITE_TYPES);
