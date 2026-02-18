/**
 * Entity Registry Service
 * 
 * Manages legal entity master data including identifiers, registrations, and directors.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const registerEntitySchema = z.object({
  name: z.string().min(1),
  legalName: z.string().min(1),
  entityType: z.enum(['corporation', 'llc', 'partnership', 'branch', 'subsidiary', 'joint-venture']),
  jurisdiction: z.string().min(2),
  incorporationDate: z.string().datetime(),
  lei: z.string().optional(),
  taxId: z.string().optional(),
  vatId: z.string().optional(),
  registrationNumber: z.string().optional(),
});

export const updateEntityIdentifiersSchema = z.object({
  entityId: z.string().uuid(),
  lei: z.string().optional(),
  taxId: z.string().optional(),
  vatId: z.string().optional(),
  gstId: z.string().optional(),
  registrationNumber: z.string().optional(),
});

export const registerDirectorSchema = z.object({
  entityId: z.string().uuid(),
  personName: z.string().min(1),
  role: z.enum(['director', 'chairman', 'ceo', 'cfo', 'secretary', 'officer']),
  appointmentDate: z.string().datetime(),
  resignationDate: z.string().datetime().optional(),
  isSignatory: z.boolean().default(false),
});

// Types
export type RegisterEntityInput = z.infer<typeof registerEntitySchema>;
export type UpdateEntityIdentifiersInput = z.infer<typeof updateEntityIdentifiersSchema>;
export type RegisterDirectorInput = z.infer<typeof registerDirectorSchema>;

export interface LegalEntity {
  id: string;
  name: string;
  legalName: string;
  entityType: string;
  jurisdiction: string;
  incorporationDate: string;
  lei: string | null;
  taxId: string | null;
  vatId: string | null;
  registrationNumber: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityDirector {
  id: string;
  entityId: string;
  personName: string;
  role: string;
  appointmentDate: string;
  resignationDate: string | null;
  isSignatory: boolean;
  status: string;
}

/**
 * Register a new legal entity
 */
export async function registerEntity(
  db: NeonHttpDatabase,
  orgId: string,
  input: RegisterEntityInput,
): Promise<LegalEntity> {
  const validated = registerEntitySchema.parse(input);
  
  // TODO: Insert into legal_entities table
  // TODO: Validate jurisdiction code
  // TODO: Check for duplicate LEI/tax IDs
  // TODO: Create audit trail entry
  
  return {
    id: '',
    name: validated.name,
    legalName: validated.legalName,
    entityType: validated.entityType,
    jurisdiction: validated.jurisdiction,
    incorporationDate: validated.incorporationDate,
    lei: validated.lei || null,
    taxId: validated.taxId || null,
    vatId: validated.vatId || null,
    registrationNumber: validated.registrationNumber || null,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update entity statutory identifiers
 */
export async function updateEntityIdentifiers(
  db: NeonHttpDatabase,
  orgId: string,
  input: UpdateEntityIdentifiersInput,
): Promise<LegalEntity> {
  const validated = updateEntityIdentifiersSchema.parse(input);
  
  // TODO: Update legal_entities table
  // TODO: Validate identifier formats
  // TODO: Check for duplicates
  // TODO: Create audit trail entry
  
  return {} as LegalEntity;
}

/**
 * Register a director or officer
 */
export async function registerDirector(
  db: NeonHttpDatabase,
  orgId: string,
  input: RegisterDirectorInput,
): Promise<EntityDirector> {
  const validated = registerDirectorSchema.parse(input);
  
  // TODO: Insert into entity_directors table
  // TODO: Validate entity exists
  // TODO: Check for overlapping appointments
  // TODO: Update signatory list if applicable
  
  return {
    id: '',
    entityId: validated.entityId,
    personName: validated.personName,
    role: validated.role,
    appointmentDate: validated.appointmentDate,
    resignationDate: validated.resignationDate || null,
    isSignatory: validated.isSignatory,
    status: 'active',
  };
}

/**
 * Get entity by ID
 */
export async function getEntity(
  db: NeonHttpDatabase,
  orgId: string,
  entityId: string,
): Promise<LegalEntity | null> {
  // TODO: Query legal_entities table
  // TODO: Filter by org_id and entity_id
  
  return null;
}

/**
 * List all entities in organization
 */
export async function listEntities(
  db: NeonHttpDatabase,
  orgId: string,
  filters?: {
    jurisdiction?: string;
    entityType?: string;
    status?: string;
  },
): Promise<LegalEntity[]> {
  // TODO: Query legal_entities table
  // TODO: Apply filters
  // TODO: Order by name
  
  return [];
}

/**
 * Get entity directors
 */
export async function getEntityDirectors(
  db: NeonHttpDatabase,
  orgId: string,
  entityId: string,
  activeOnly: boolean = true,
): Promise<EntityDirector[]> {
  // TODO: Query entity_directors table
  // TODO: Filter by entity_id and status
  // TODO: Order by appointment_date DESC
  
  return [];
}

/**
 * Get signatories for entity
 */
export async function getEntitySignatories(
  db: NeonHttpDatabase,
  orgId: string,
  entityId: string,
): Promise<EntityDirector[]> {
  // TODO: Query entity_directors table
  // TODO: Filter by entity_id, is_signatory=true, status=active
  // TODO: Order by role, appointment_date
  
  return [];
}

/**
 * Deactivate entity
 */
export async function deactivateEntity(
  db: NeonHttpDatabase,
  orgId: string,
  entityId: string,
  reason: string,
): Promise<void> {
  // TODO: Update legal_entities status to 'inactive'
  // TODO: Create audit trail entry with reason
  // TODO: Notify dependent systems
}
