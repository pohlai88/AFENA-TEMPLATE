import { z } from 'zod';

export const META_EDGE_TYPES = ['ingests', 'transforms', 'serves', 'derives'] as const;
export type MetaEdgeType = (typeof META_EDGE_TYPES)[number];
export const metaEdgeTypeSchema = z.enum(META_EDGE_TYPES);
