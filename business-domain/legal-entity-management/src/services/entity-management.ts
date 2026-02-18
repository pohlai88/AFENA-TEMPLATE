import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface LegalEntity {
  id: string;
  orgId: string;
  entityCode: string;
  entityName: string;
  legalForm: 'CORPORATION' | 'LLC' | 'PARTNERSHIP' | 'SOLE_PROPRIETORSHIP' | 'BRANCH';
  jurisdiction: string;
  taxId: string;
  incorporationDate: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'DISSOLVED';
  parentEntityId?: string;
  baseCurrency: string;
  fiscalYearEnd: string; // MM-DD
}

export interface EntityRelationship {
  id: string;
  parentEntityId: string;
  childEntityId: string;
  relationshipType: 'SUBSIDIARY' | 'AFFILIATE' | 'BRANCH' | 'JOINT_VENTURE';
  ownershipPercentage: number;
  effectiveDate: Date;
  endDate?: Date;
}

export async function createLegalEntity(
  db: NeonHttpDatabase,
  data: Omit<LegalEntity, 'id' | 'status'>,
): Promise<LegalEntity> {
  // TODO: Insert legal entity with ACTIVE status
  throw new Error('Database integration pending');
}

export async function establishRelationship(
  db: NeonHttpDatabase,
  data: Omit<EntityRelationship, 'id'>,
): Promise<EntityRelationship> {
  // TODO: Insert entity relationship
  throw new Error('Database integration pending');
}

export async function getEntityHierarchy(
  db: NeonHttpDatabase,
  rootEntityId: string,
): Promise<Array<LegalEntity & { children: LegalEntity[] }>> {
  // TODO: Build entity hierarchy tree
  throw new Error('Database integration pending');
}

export async function updateEntityStatus(
  db: NeonHttpDatabase,
  entityId: string,
  status: LegalEntity['status'],
  effectiveDate: Date,
): Promise<LegalEntity> {
  // TODO: Update entity status
  throw new Error('Database integration pending');
}

export function buildEntityTree(
  entities: LegalEntity[],
  relationships: EntityRelationship[],
): Array<LegalEntity & { children: LegalEntity[]; ownershipPercentage?: number }> {
  type EntityNode = LegalEntity & { children: EntityNode[]; ownershipPercentage?: number };
  
  const entityMap = new Map<string, EntityNode>();
  
  for (const entity of entities) {
    entityMap.set(entity.id, { ...entity, children: [] });
  }

  const roots: EntityNode[] = [];

  for (const rel of relationships) {
    const parent = entityMap.get(rel.parentEntityId);
    const child = entityMap.get(rel.childEntityId);

    if (parent && child) {
      child.ownershipPercentage = rel.ownershipPercentage;
      parent.children.push(child);
    }
  }

  for (const entity of entityMap.values()) {
    if (!entity.parentEntityId) {
      roots.push(entity);
    }
  }

  return roots;
}

export function calculateConsolidationScope(
  entities: LegalEntity[],
  relationships: EntityRelationship[],
  consolidationMethod: 'FULL' | 'PROPORTIONAL' | 'EQUITY',
): Array<{ entityId: string; includeInConsolidation: boolean; method: string }> {
  return entities.map((entity) => {
    const rel = relationships.find((r) => r.childEntityId === entity.id);
    
    let includeInConsolidation = false;
    let method = 'NONE';

    if (rel) {
      if (consolidationMethod === 'FULL' && rel.ownershipPercentage > 50) {
        includeInConsolidation = true;
        method = 'FULL';
      } else if (consolidationMethod === 'PROPORTIONAL' && rel.ownershipPercentage >= 20) {
        includeInConsolidation = true;
        method = 'PROPORTIONAL';
      } else if (consolidationMethod === 'EQUITY' && rel.ownershipPercentage >= 20 && rel.ownershipPercentage <= 50) {
        includeInConsolidation = true;
        method = 'EQUITY';
      }
    }

    return { entityId: entity.id, includeInConsolidation, method };
  });
}

export function validateEntityStructure(
  entities: LegalEntity[],
  relationships: EntityRelationship[],
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for circular references
  for (const rel of relationships) {
    if (rel.parentEntityId === rel.childEntityId) {
      issues.push(`Circular reference detected: ${rel.parentEntityId}`);
    }
  }

  // Check ownership percentages
  for (const rel of relationships) {
    if (rel.ownershipPercentage < 0 || rel.ownershipPercentage > 100) {
      issues.push(`Invalid ownership percentage for ${rel.childEntityId}: ${rel.ownershipPercentage}`);
    }
  }

  return { valid: issues.length === 0, issues };
}
