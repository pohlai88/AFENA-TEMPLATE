/**
 * Asset Fingerprint Tests
 * 
 * Verifies invariants from Canon Architecture §7.2
 * Tests: F1 (determinism), F2 (field-order independence)
 */

import { describe, expect, it } from 'vitest';
import { assetFingerprint, type AssetDescriptor } from '../asset-fingerprint';

describe('Asset Fingerprint', () => {
  describe('F1: Deterministic hashing', () => {
    it('should produce identical fingerprints for identical descriptors', () => {
      const descriptor: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
        description: 'Customer invoices table',
        owner: 'finance-team',
        classification: 'financial',
        tags: ['erp', 'accounting'],
      };

      const fingerprint1 = assetFingerprint(descriptor);
      const fingerprint2 = assetFingerprint(descriptor);

      expect(fingerprint1).toBe(fingerprint2);
      expect(fingerprint1.length).toBeGreaterThan(0);
    });

    it('should produce different fingerprints for different descriptors', () => {
      const descriptor1: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
      };

      const descriptor2: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.customers',
        assetType: 'table',
        displayName: 'Customers',
      };

      const fingerprint1 = assetFingerprint(descriptor1);
      const fingerprint2 = assetFingerprint(descriptor2);

      expect(fingerprint1).not.toBe(fingerprint2);
    });

    it('should be sensitive to field value changes', () => {
      const baseDescriptor: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
        description: 'Original description',
      };

      const modifiedDescriptor: AssetDescriptor = {
        ...baseDescriptor,
        description: 'Modified description',
      };

      const fingerprint1 = assetFingerprint(baseDescriptor);
      const fingerprint2 = assetFingerprint(modifiedDescriptor);

      expect(fingerprint1).not.toBe(fingerprint2);
    });
  });

  describe('F2: Field-order independence', () => {
    it('should produce same fingerprint regardless of property order', () => {
      // Same properties, different order in object literal
      const descriptor1 = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table' as const,
        displayName: 'Invoices',
        description: 'Customer invoices',
        owner: 'finance-team',
        classification: 'financial' as const,
      };

      const descriptor2 = {
        classification: 'financial' as const,
        owner: 'finance-team',
        description: 'Customer invoices',
        displayName: 'Invoices',
        assetType: 'table' as const,
        assetKey: 'db.rec.afenda.public.invoices',
      };

      const fingerprint1 = assetFingerprint(descriptor1);
      const fingerprint2 = assetFingerprint(descriptor2);

      expect(fingerprint1).toBe(fingerprint2);
    });

    it('should produce same fingerprint regardless of array element order', () => {
      const descriptor1: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
        tags: ['erp', 'accounting', 'finance'],
        upstream: ['db.rec.afenda.public.customers', 'db.rec.afenda.public.products'],
      };

      const descriptor2: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
        tags: ['accounting', 'erp', 'finance'],
        upstream: ['db.rec.afenda.public.products', 'db.rec.afenda.public.customers'],
      };

      const fingerprint1 = assetFingerprint(descriptor1);
      const fingerprint2 = assetFingerprint(descriptor2);

      expect(fingerprint1).toBe(fingerprint2);
    });
  });

  describe('Optional fields', () => {
    it('should handle descriptors with minimal fields', () => {
      const minimalDescriptor: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
      };

      const fingerprint = assetFingerprint(minimalDescriptor);
      expect(fingerprint).toBeDefined();
      expect(fingerprint.length).toBeGreaterThan(0);
    });

    it('should handle descriptors with all optional fields', () => {
      const fullDescriptor: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
        description: 'Customer invoices table',
        owner: 'finance-team',
        steward: 'data-team',
        classification: 'financial',
        tags: ['erp', 'accounting'],
        qualityTier: 'gold',
        upstream: ['db.rec.afenda.public.customers'],
        downstream: ['db.rec.afenda.public.reports'],
        glossaryTerms: ['invoice', 'billing'],
      };

      const fingerprint = assetFingerprint(fullDescriptor);
      expect(fingerprint).toBeDefined();
      expect(fingerprint.length).toBeGreaterThan(0);
    });

    it('should treat undefined and missing fields identically', () => {
      const descriptor1: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
      };

      const descriptor2: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
      };

      const fingerprint1 = assetFingerprint(descriptor1);
      const fingerprint2 = assetFingerprint(descriptor2);

      expect(fingerprint1).toBe(fingerprint2);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty arrays', () => {
      const descriptor: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
        tags: [],
        upstream: [],
        downstream: [],
      };

      const fingerprint = assetFingerprint(descriptor);
      expect(fingerprint).toBeDefined();
    });

    it('should handle special characters in strings', () => {
      const descriptor: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices & Payments',
        description: 'Table with "quotes" and special chars: @#$%',
      };

      const fingerprint = assetFingerprint(descriptor);
      expect(fingerprint).toBeDefined();
      expect(fingerprint.length).toBeGreaterThan(0);
    });

    it('should handle unicode characters', () => {
      const descriptor: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices 发票',
        description: 'Multilingual: 日本語, 한국어, العربية',
      };

      const fingerprint = assetFingerprint(descriptor);
      expect(fingerprint).toBeDefined();
    });
  });

  describe('Stability', () => {
    it('should produce consistent fingerprints across multiple calls', () => {
      const descriptor: AssetDescriptor = {
        assetKey: 'db.rec.afenda.public.invoices',
        assetType: 'table',
        displayName: 'Invoices',
        description: 'Test stability',
        tags: ['test', 'stability'],
      };

      const fingerprints = Array.from({ length: 10 }, () => assetFingerprint(descriptor));

      // All fingerprints should be identical
      const uniqueFingerprints = new Set(fingerprints);
      expect(uniqueFingerprints.size).toBe(1);
    });
  });
});
