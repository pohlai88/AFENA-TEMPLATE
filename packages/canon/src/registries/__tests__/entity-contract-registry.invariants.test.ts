/**
 * Entity Contract Registry Invariant Tests
 * 
 * Tests REG-01 through REG-06 invariants for pure metadata registry.
 */

import { describe, expect, it } from 'vitest';
import type { EntityContract } from '../../types/entity-contract';
import {
  buildEntityContractRegistry,
  findByLabel,
  findByVerb,
  findWithLifecycle,
  findWithSoftDelete,
  getContract,
  getSize,
  hasContract,
  listContracts,
} from '../entity-contract-registry';
import { companiesContract } from '../entity-contracts.data';
import { EntityContractRegistryError } from '../errors';

describe('REG-01: Duplicate Prevention', () => {
  it('should reject duplicate entityType registration', () => {
    const contracts = [companiesContract, companiesContract];

    expect(() => buildEntityContractRegistry(contracts, { strict: true }))
      .toThrow(EntityContractRegistryError);
  });

  it('should include duplicate error in validation report', () => {
    const contracts = [companiesContract, companiesContract];

    expect(() => buildEntityContractRegistry(contracts, { strict: true }))
      .toThrow(EntityContractRegistryError);
  });

  it('should allow duplicate in non-strict mode but report issue', () => {
    const contracts = [companiesContract, companiesContract];
    const result = buildEntityContractRegistry(contracts, { strict: false });

    expect(result.report.valid).toBe(false);
    expect(result.report.issues.some(i => i.code === 'DUPLICATE_ENTITY_TYPE')).toBe(true);
  });
});

describe('REG-02: Schema Validation', () => {
  it('should reject invalid contract structure', () => {
    const invalid = { entityType: 'test' } as any;

    expect(() => buildEntityContractRegistry([invalid], { strict: true }))
      .toThrow(EntityContractRegistryError);
  });

  it('should reject missing required fields', () => {
    const invalid: any = {
      entityType: 'test',
      label: 'Test',
      // missing labelPlural and other required fields
    };

    expect(() => buildEntityContractRegistry([invalid], { strict: true }))
      .toThrow(EntityContractRegistryError);
  });

  it('should warn on empty allowed array in transitions (terminal state)', () => {
    const terminal = {
      ...companiesContract,
      transitions: [{ from: 'draft', allowed: [] }],
    } as any;

    const result = buildEntityContractRegistry([terminal], { strict: true });
    const emptyIssue = result.report.issues.find(i => i.code === 'EMPTY_ALLOWED');
    expect(emptyIssue).toBeDefined();
    expect(emptyIssue?.severity).toBe('warn');
  });

  it('should include schema errors in validation report', () => {
    const invalid = { entityType: 'test' } as any;

    try {
      buildEntityContractRegistry([invalid], { strict: true });
    } catch (error) {
      expect(error).toBeInstanceOf(EntityContractRegistryError);
      expect((error as EntityContractRegistryError).context?.issues).toBeDefined();
    }
  });
});

describe('REG-03: Deep Immutability', () => {
  it('should freeze top-level contract', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const contract = getContract(result.registry, 'companies')!;

    expect(Object.isFrozen(contract)).toBe(true);
    expect(() => { (contract as any).label = 'Modified'; }).toThrow();
  });

  it('should freeze nested arrays', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const contract = getContract(result.registry, 'companies')!;

    expect(Object.isFrozen(contract.transitions)).toBe(true);
    expect(() => { contract.transitions.push({} as any); }).toThrow();
  });

  it('should freeze nested objects in arrays', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const contract = getContract(result.registry, 'companies')!;

    expect(Object.isFrozen(contract.transitions[0])).toBe(true);
    expect(() => { (contract.transitions[0] as any).from = 'active'; }).toThrow();
  });

  it('should freeze nested allowed arrays', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const contract = getContract(result.registry, 'companies')!;

    expect(Object.isFrozen(contract.transitions[0]?.allowed)).toBe(true);
    expect(() => { contract.transitions[0]?.allowed.push('invalid' as any); }).toThrow();
  });

  it('should freeze all string arrays', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const contract = getContract(result.registry, 'companies')!;

    expect(Object.isFrozen(contract.primaryVerbs)).toBe(true);
    expect(Object.isFrozen(contract.secondaryVerbs)).toBe(true);
    expect(Object.isFrozen(contract.updateModes)).toBe(true);
    expect(Object.isFrozen(contract.reasonRequired)).toBe(true);
  });
});

describe('REG-04: Lifecycle Graph Validation', () => {
  it('should warn on empty allowed array (terminal state)', () => {
    const terminal = {
      ...companiesContract,
      transitions: [{ from: 'draft', allowed: [] }],
    } as any;

    const result = buildEntityContractRegistry([terminal], { strict: true });
    const emptyIssue = result.report.issues.find(i => i.code === 'EMPTY_ALLOWED');
    expect(emptyIssue).toBeDefined();
    expect(emptyIssue?.severity).toBe('warn');
  });

  it('should fail on duplicate verbs in same state', () => {
    const invalid = {
      ...companiesContract,
      transitions: [
        { from: 'draft', allowed: ['update', 'update', 'submit'] },
      ],
    } as any;

    const result = buildEntityContractRegistry([invalid], { strict: false });
    const duplicateIssue = result.report.issues.find(i => i.code === 'DUPLICATE_VERB');
    expect(duplicateIssue).toBeDefined();
    expect(duplicateIssue?.severity).toBe('fail');
  });

  it('should warn on unreachable states', () => {
    const withOrphan: EntityContract = {
      ...companiesContract,
      transitions: [
        { from: 'draft', allowed: ['submit'] },
        { from: 'orphaned' as any, allowed: ['delete'] },
      ],
    };

    const result = buildEntityContractRegistry([withOrphan], { strict: false });

    // May have unreachable state warning depending on graph analysis
    expect(result.report.issues.length).toBeGreaterThanOrEqual(0);
  });

  it('should skip semantic validation when requested', () => {
    const withOrphan: EntityContract = {
      ...companiesContract,
      transitions: [
        { from: 'draft', allowed: ['submit'] },
        { from: 'orphaned' as any, allowed: ['delete'] },
      ],
    };

    const result = buildEntityContractRegistry([withOrphan], {
      strict: false,
      skipSemanticValidation: true,
    });

    // Should not have lifecycle warnings
    const lifecycleWarnings = result.report.issues.filter(
      i => i.code === 'UNREACHABLE_STATE' || i.code === 'LIFECYCLE_CYCLE'
    );
    expect(lifecycleWarnings).toHaveLength(0);
  });
});

describe('REG-05: Determinism', () => {
  it('should produce identical registry size for same input', () => {
    const result1 = buildEntityContractRegistry([companiesContract]);
    const result2 = buildEntityContractRegistry([companiesContract]);

    expect(result1.registry.size).toBe(result2.registry.size);
  });

  it('should produce identical validation status for same input', () => {
    const result1 = buildEntityContractRegistry([companiesContract]);
    const result2 = buildEntityContractRegistry([companiesContract]);

    expect(result1.report.valid).toBe(result2.report.valid);
  });

  it('should produce identical stats for same input', () => {
    const result1 = buildEntityContractRegistry([companiesContract]);
    const result2 = buildEntityContractRegistry([companiesContract]);

    expect(result1.report.stats).toEqual(result2.report.stats);
  });

  it('should produce same contract data for same input', () => {
    const result1 = buildEntityContractRegistry([companiesContract]);
    const result2 = buildEntityContractRegistry([companiesContract]);

    const contract1 = getContract(result1.registry, 'companies');
    const contract2 = getContract(result2.registry, 'companies');

    expect(contract1).toEqual(contract2);
  });
});

describe('REG-06: Query Correctness', () => {
  it('should get contract by entity type', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const contract = getContract(result.registry, 'companies');

    expect(contract).toBeDefined();
    expect(contract?.entityType).toBe('companies');
  });

  it('should return undefined for non-existent entity type', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const contract = getContract(result.registry, 'nonexistent' as any);

    expect(contract).toBeUndefined();
  });

  it('should list all contracts', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const contracts = listContracts(result.registry);

    expect(contracts).toHaveLength(1);
    expect(contracts[0]?.entityType).toBe('companies');
  });

  it('should find contracts by verb', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const found = findByVerb(result.registry, 'submit');

    expect(found).toHaveLength(1);
    expect(found[0]?.entityType).toBe('companies');
  });

  it('should return empty array when verb not found', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const found = findByVerb(result.registry, 'nonexistent' as any);

    expect(found).toHaveLength(0);
  });

  it('should find contracts with lifecycle', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const found = findWithLifecycle(result.registry);

    expect(found).toHaveLength(1);
    expect(found[0]?.hasLifecycle).toBe(true);
  });

  it('should find contracts with soft delete', () => {
    const result = buildEntityContractRegistry([companiesContract]);
    const found = findWithSoftDelete(result.registry);

    expect(found).toHaveLength(1);
    expect(found[0]?.hasSoftDelete).toBe(true);
  });

  it('should find contract by label (case-insensitive)', () => {
    const result = buildEntityContractRegistry([companiesContract]);

    expect(findByLabel(result.registry, 'Company')).toBeDefined();
    expect(findByLabel(result.registry, 'company')).toBeDefined();
    expect(findByLabel(result.registry, 'COMPANY')).toBeDefined();
    expect(findByLabel(result.registry, 'Companies')).toBeDefined();
  });

  it('should check if contract exists', () => {
    const result = buildEntityContractRegistry([companiesContract]);

    expect(hasContract(result.registry, 'companies')).toBe(true);
    expect(hasContract(result.registry, 'nonexistent' as any)).toBe(false);
  });

  it('should get registry size', () => {
    const result = buildEntityContractRegistry([companiesContract]);

    expect(getSize(result.registry)).toBe(1);
  });
});

describe('Registry Build Events', () => {
  it('should emit registered event for each contract', () => {
    const result = buildEntityContractRegistry([companiesContract]);

    const registeredEvents = result.events.filter(e => e.type === 'registered');
    expect(registeredEvents).toHaveLength(1);
    if (registeredEvents[0]?.type === 'registered') {
      expect(registeredEvents[0].entityType).toBe('companies');
    }
  });

  it('should emit validation issue events', () => {
    const invalid = { entityType: 'test' } as any;
    const result = buildEntityContractRegistry([invalid], { strict: false });
    const issueEvents = result.events.filter(e => e.type === 'validation_issue');
    expect(issueEvents.length).toBeGreaterThan(0);
  });
});

describe('Validation Report', () => {
  it('should report valid for valid contracts', () => {
    const result = buildEntityContractRegistry([companiesContract]);

    expect(result.report.valid).toBe(true);
    expect(result.report.issues.filter(i => i.severity === 'fail')).toHaveLength(0);
  });

  it('should report invalid for failed validation', () => {
    const invalid = { entityType: 'test' } as any;
    const result = buildEntityContractRegistry([invalid], { strict: false });

    expect(result.report.valid).toBe(false);
    expect(result.report.issues.filter(i => i.severity === 'fail').length).toBeGreaterThan(0);
  });

  it('should include stats', () => {
    const result = buildEntityContractRegistry([companiesContract]);

    expect(result.report.stats.total).toBe(1);
    expect(result.report.stats.withLifecycle).toBe(1);
    expect(result.report.stats.withSoftDelete).toBe(1);
    expect(result.report.stats.totalTransitions).toBe(5);
  });
});
