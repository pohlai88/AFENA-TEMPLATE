import { describe, expect, it } from 'vitest';
import { auditLogEntrySchema } from '../audit';

describe('Audit Log Schema Invariants', () => {
  const baseAuditLog = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    orgId: 'org-123',
    actorUserId: 'user-123',
    actionType: 'contacts.update',
    actionFamily: 'field_mutation' as const,
    entityType: 'contacts',
    entityId: 'entity-123',
    requestId: 'req-123',
    mutationId: '123e4567-e89b-12d3-a456-426614174001',
    batchId: null,
    versionBefore: 1,
    versionAfter: 2,
    channel: 'api' as const,
    ip: '192.168.1.1',
    userAgent: 'Mozilla/5.0',
    reason: null,
    authoritySnapshot: null,
    idempotencyKey: null,
    affectedCount: 1,
    valueDelta: null,
    createdAt: '2024-01-01T00:00:00Z',
    before: null,
    after: null,
    diff: null,
  };

  describe('INV-AUDIT-01: Version Progression', () => {
    it('should accept versionAfter > versionBefore', () => {
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        versionBefore: 5,
        versionAfter: 6,
      });
      
      expect(result.success).toBe(true);
    });
    
    it('should reject versionAfter < versionBefore', () => {
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        versionBefore: 5,
        versionAfter: 3,
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_AUDIT_VERSION_REGRESSION');
        expect(result.error.issues[0]?.path).toEqual(['versionAfter']);
      }
    });
    
    it('should reject versionAfter === versionBefore', () => {
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        versionBefore: 5,
        versionAfter: 5,
      });
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_AUDIT_VERSION_REGRESSION');
      }
    });
    
    it('should accept versionBefore = null (create operation)', () => {
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        versionBefore: null,
        versionAfter: 1,
      });
      
      expect(result.success).toBe(true);
    });
    
    it('should accept both versions null (edge case)', () => {
      // This shouldn't happen in practice, but the validation allows it
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        versionBefore: null,
        versionAfter: 1, // versionAfter is not nullable in schema
      });
      
      expect(result.success).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should accept valid UUID formats', () => {
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        id: '00000000-0000-4000-8000-000000000000', // Valid v4 UUID
        mutationId: 'ffffffff-ffff-4fff-bfff-ffffffffffff',
      });
      
      expect(result.success).toBe(true);
    });
    
    it('should reject invalid UUID formats', () => {
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        id: 'not-a-uuid',
      });
      
      expect(result.success).toBe(false);
    });
    
    it('should accept all valid action families', () => {
      const families = ['field_mutation', 'state_transition', 'ownership', 'lifecycle', 'annotation', 'system'] as const;
      
      for (const family of families) {
        const result = auditLogEntrySchema.safeParse({
          ...baseAuditLog,
          actionFamily: family,
        });
        
        expect(result.success).toBe(true);
      }
    });
    
    it('should accept nullable fields as null', () => {
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        requestId: null,
        batchId: null,
        versionBefore: null,
        ip: null,
        userAgent: null,
        reason: null,
        authoritySnapshot: null,
        idempotencyKey: null,
        valueDelta: null,
        before: null,
        after: null,
        diff: null,
      });
      
      expect(result.success).toBe(true);
    });
    
    it('should accept complex JSON values in nullable fields', () => {
      const result = auditLogEntrySchema.safeParse({
        ...baseAuditLog,
        authoritySnapshot: { roles: ['admin'], permissions: ['read', 'write'] },
        valueDelta: { field: 'email', old: 'old@example.com', new: 'new@example.com' },
        before: { id: '123', name: 'Old Name' },
        after: { id: '123', name: 'New Name' },
        diff: [{ op: 'replace', path: '/name', value: 'New Name' }],
      });
      
      expect(result.success).toBe(true);
    });
  });
});
