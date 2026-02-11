import { z } from 'zod';

import { ACTION_FAMILIES, ACTION_TYPES } from '../types/action';

export const actionTypeSchema = z.enum(ACTION_TYPES);

export const actionFamilySchema = z.enum(ACTION_FAMILIES);
