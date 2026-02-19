import { describe, expect, it } from 'vitest';
import { jsonValueSchema } from '../json-value';

describe('JSON Value Schema Invariants', () => {
  describe('INV-JSON-01: Depth Limit', () => {
    it('should accept JSON within depth limit (depth 31)', () => {
      // Create nested object with depth 31
      let deep: any = 'leaf';
      for (let i = 0; i < 31; i++) {
        deep = { nested: deep };
      }
      
      const result = jsonValueSchema.safeParse(deep);
      expect(result.success).toBe(true);
    });
    
    it('should reject JSON exceeding depth limit (depth 33)', () => {
      // Create nested object with depth 33
      let deep: any = 'leaf';
      for (let i = 0; i < 33; i++) {
        deep = { nested: deep };
      }
      
      const result = jsonValueSchema.safeParse(deep);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_JSON_DEPTH_EXCEEDED');
      }
    });
    
    it('should accept JSON at exact depth limit (depth 32)', () => {
      // Create nested object with depth 32
      let deep: any = 'leaf';
      for (let i = 0; i < 32; i++) {
        deep = { nested: deep };
      }
      
      const result = jsonValueSchema.safeParse(deep);
      expect(result.success).toBe(true);
    });
    
    it('should accept large shallow objects', () => {
      // Large object with many keys but shallow depth
      const shallow: Record<string, number> = {};
      for (let i = 0; i < 1000; i++) {
        shallow[`key${i}`] = i;
      }
      
      const result = jsonValueSchema.safeParse(shallow);
      expect(result.success).toBe(true);
    });
    
    it('should accept deeply nested arrays', () => {
      // Create nested array with depth 31
      let deep: any = ['leaf'];
      for (let i = 0; i < 31; i++) {
        deep = [deep];
      }
      
      const result = jsonValueSchema.safeParse(deep);
      expect(result.success).toBe(true);
    });
    
    it('should reject deeply nested arrays exceeding limit', () => {
      // Create nested array with depth 33
      let deep: any = ['leaf'];
      for (let i = 0; i < 33; i++) {
        deep = [deep];
      }
      
      const result = jsonValueSchema.safeParse(deep);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('CANON_JSON_DEPTH_EXCEEDED');
      }
    });
    
    it('should accept mixed nesting (objects and arrays)', () => {
      // Create mixed nested structure with depth 31
      let deep: any = 'leaf';
      for (let i = 0; i < 31; i++) {
        deep = i % 2 === 0 ? { nested: deep } : [deep];
      }
      
      const result = jsonValueSchema.safeParse(deep);
      expect(result.success).toBe(true);
    });
    
    it('should accept primitive values', () => {
      expect(jsonValueSchema.safeParse('string').success).toBe(true);
      expect(jsonValueSchema.safeParse(123).success).toBe(true);
      expect(jsonValueSchema.safeParse(true).success).toBe(true);
      expect(jsonValueSchema.safeParse(null).success).toBe(true);
    });
  });
});
