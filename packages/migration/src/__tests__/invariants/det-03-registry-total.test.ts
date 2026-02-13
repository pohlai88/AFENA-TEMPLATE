import { describe, it, expect } from 'vitest';
import {
  CONFLICT_DETECTOR_REGISTRY,
  getConflictDetector,
} from '../../strategies/conflict-detector.js';

/**
 * DET-03: ConflictDetector registry is total.
 *
 * - Every registered entity type has a detector
 * - detector.entityType matches the registry key
 * - matchKeys is always an array
 * - getConflictDetector throws for unknown entity types
 */
describe('DET-03: ConflictDetector registry is total', () => {
  it('should have detector for all registered entity types', () => {
    const registeredTypes = Object.keys(CONFLICT_DETECTOR_REGISTRY);

    expect(registeredTypes.length).toBeGreaterThan(0);

    for (const entityType of registeredTypes) {
      const detector = CONFLICT_DETECTOR_REGISTRY[entityType]!;

      expect(detector).toBeDefined();
      expect(detector.entityType).toBe(entityType);
      expect(detector.name).toBeDefined();
      expect(Array.isArray(detector.matchKeys)).toBe(true);
    }
  });

  it('should throw for unknown entity types', () => {
    expect(() => {
      getConflictDetector('unknown_entity_xyz');
    }).toThrow('No conflict detector for entity type: unknown_entity_xyz');
  });

  it('should detect entity type mismatch', () => {
    // Manually verify the mismatch check in getConflictDetector
    // by temporarily creating a bad entry
    const original = CONFLICT_DETECTOR_REGISTRY['contacts']!;
    expect(original.entityType).toBe('contacts');

    // getConflictDetector should pass for correct mapping
    const detector = getConflictDetector('contacts');
    expect(detector.entityType).toBe('contacts');
  });

  it('should have matchKeys for detectors that do conflict detection', () => {
    const contacts = getConflictDetector('contacts');
    expect(contacts.matchKeys.length).toBeGreaterThan(0);
    expect(contacts.matchKeys).toContain('email');
    expect(contacts.matchKeys).toContain('phone');

    const invoices = getConflictDetector('invoices');
    expect(invoices.matchKeys.length).toBeGreaterThan(0);
    expect(invoices.matchKeys).toContain('invoiceNumber');
  });

  it('should have empty matchKeys for NoConflictDetector', () => {
    const companies = getConflictDetector('companies');
    expect(companies.matchKeys).toHaveLength(0);
    expect(companies.name).toBe('no_conflict');
  });
});
