/**
 * Capability System Tests
 * 
 * Tests for capability parser, validator, and RBAC derivation logic.
 */

import { describe, expect, it } from 'vitest';

import {
  ACTION_FAMILY_TO_TIER,
  CAPABILITY_CATALOG,
  CAPABILITY_DOMAINS,
  CAPABILITY_KINDS,
  CAPABILITY_NAMESPACES,
  CAPABILITY_VERBS,
  inferKindFromVerb,
  KIND_TO_SCOPE,
  KIND_TO_TIER,
  parseCapabilityKey,
  RBAC_SCOPES,
  RBAC_TIERS,
  validateCapabilityKey,
  VERB_TO_KIND,
} from '../index';

describe('Capability Parser', () => {
  describe('parseCapabilityKey', () => {
    it('should parse domain.verb format (2 parts)', () => {
      const result = parseCapabilityKey('contacts.create');

      expect(result).toEqual({
        shape: 'domain',
        ns: null,
        domain: 'contacts',
        verb: 'create',
      });
    });

    it('should parse namespace.verb format (2 parts)', () => {
      const result = parseCapabilityKey('auth.sign_in');

      expect(result).toEqual({
        shape: 'namespace',
        ns: 'auth',
        domain: null,
        verb: 'sign_in',
      });
    });

    it('should parse namespace.domain.verb format (3 parts)', () => {
      const result = parseCapabilityKey('admin.custom_fields.define');

      expect(result).toEqual({
        shape: 'namespaced-domain',
        ns: 'admin',
        domain: 'custom_fields',
        verb: 'define',
      });
    });

    it('should throw on invalid format (1 part)', () => {
      expect(() => parseCapabilityKey('invalid')).toThrow(
        'Invalid capability key: "invalid" (must be 2 or 3 parts)'
      );
    });

    it('should throw on invalid format (4+ parts)', () => {
      expect(() => parseCapabilityKey('too.many.parts.here')).toThrow(
        'Invalid capability key: "too.many.parts.here" (must be 2 or 3 parts)'
      );
    });

    it('should distinguish namespace from domain in 2-part keys', () => {
      // Namespace (auth is in CAPABILITY_NAMESPACES)
      const authResult = parseCapabilityKey('auth.sign_in');
      expect(authResult.shape).toBe('namespace');
      expect(authResult.ns).toBe('auth');
      expect(authResult.domain).toBe(null);

      // Domain (contacts is in CAPABILITY_DOMAINS)
      const contactsResult = parseCapabilityKey('contacts.create');
      expect(contactsResult.shape).toBe('domain');
      expect(contactsResult.ns).toBe(null);
      expect(contactsResult.domain).toBe('contacts');
    });
  });

  describe('validateCapabilityKey', () => {
    it('should validate and parse valid domain.verb key', () => {
      const result = validateCapabilityKey('contacts.create');

      expect(result).toEqual({
        shape: 'domain',
        ns: null,
        domain: 'contacts',
        verb: 'create',
      });
    });

    it('should throw on unknown verb', () => {
      expect(() => validateCapabilityKey('contacts.invalid_verb')).toThrow(
        'Unknown verb "invalid_verb" in key "contacts.invalid_verb"'
      );
    });

    it('should throw on unknown domain', () => {
      expect(() => validateCapabilityKey('unknown_domain.create')).toThrow(
        'Unknown domain "unknown_domain" in key "unknown_domain.create"'
      );
    });

    it('should throw on unknown namespace', () => {
      expect(() => validateCapabilityKey('unknown_ns.contacts.create')).toThrow(
        'Unknown namespace "unknown_ns" in key "unknown_ns.contacts.create"'
      );
    });

    it('should validate all keys in CAPABILITY_CATALOG', () => {
      // All catalog keys should be valid
      for (const key of Object.keys(CAPABILITY_CATALOG)) {
        expect(() => validateCapabilityKey(key)).not.toThrow();
      }
    });
  });

  describe('inferKindFromVerb', () => {
    it('should infer mutation kind from mutation verbs', () => {
      expect(inferKindFromVerb('create')).toBe('mutation');
      expect(inferKindFromVerb('update')).toBe('mutation');
      expect(inferKindFromVerb('delete')).toBe('mutation');
      expect(inferKindFromVerb('restore')).toBe('mutation');
    });

    it('should infer read kind from read verbs', () => {
      expect(inferKindFromVerb('read')).toBe('read');
      expect(inferKindFromVerb('list')).toBe('read');
      expect(inferKindFromVerb('versions')).toBe('read');
      expect(inferKindFromVerb('audit')).toBe('read');
    });

    it('should infer search kind from search verbs', () => {
      expect(inferKindFromVerb('search')).toBe('search');
      expect(inferKindFromVerb('global')).toBe('search');
    });

    it('should infer admin kind from admin verbs', () => {
      expect(inferKindFromVerb('define')).toBe('admin');
      expect(inferKindFromVerb('manage')).toBe('admin');
      expect(inferKindFromVerb('configure')).toBe('admin');
    });

    it('should infer system kind from system verbs', () => {
      expect(inferKindFromVerb('evaluate')).toBe('system');
      expect(inferKindFromVerb('run')).toBe('system');
      expect(inferKindFromVerb('explain')).toBe('system');
    });

    it('should infer auth kind from auth verbs', () => {
      expect(inferKindFromVerb('sign_in')).toBe('auth');
      expect(inferKindFromVerb('sign_out')).toBe('auth');
      expect(inferKindFromVerb('refresh')).toBe('auth');
    });

    it('should infer storage kind from storage verbs', () => {
      expect(inferKindFromVerb('upload')).toBe('storage');
      expect(inferKindFromVerb('download')).toBe('storage');
      expect(inferKindFromVerb('metadata')).toBe('storage');
    });

    it('should throw on unknown verb', () => {
      expect(() => inferKindFromVerb('unknown_verb')).toThrow(
        'Unknown verb: "unknown_verb"'
      );
    });
  });
});

describe('RBAC Derivation', () => {
  describe('ACTION_FAMILY_TO_TIER', () => {
    it('should map field_mutation to editor', () => {
      expect(ACTION_FAMILY_TO_TIER.field_mutation).toBe('editor');
    });

    it('should map lifecycle to editor', () => {
      expect(ACTION_FAMILY_TO_TIER.lifecycle).toBe('editor');
    });

    it('should map state_transition to manager', () => {
      expect(ACTION_FAMILY_TO_TIER.state_transition).toBe('manager');
    });

    it('should map ownership to admin', () => {
      expect(ACTION_FAMILY_TO_TIER.ownership).toBe('admin');
    });

    it('should map annotation to editor', () => {
      expect(ACTION_FAMILY_TO_TIER.annotation).toBe('editor');
    });

    it('should map system to system', () => {
      expect(ACTION_FAMILY_TO_TIER.system).toBe('system');
    });

    it('should have entries for all action families', () => {
      const families = Object.keys(ACTION_FAMILY_TO_TIER).sort();
      expect(families).toEqual([
        'annotation',
        'field_mutation',
        'lifecycle',
        'ownership',
        'state_transition',
        'system',
      ]);
    });
  });

  describe('KIND_TO_TIER', () => {
    it('should map mutation to editor', () => {
      expect(KIND_TO_TIER.mutation).toBe('editor');
    });

    it('should map read to viewer', () => {
      expect(KIND_TO_TIER.read).toBe('viewer');
    });

    it('should map search to viewer', () => {
      expect(KIND_TO_TIER.search).toBe('viewer');
    });

    it('should map admin to admin', () => {
      expect(KIND_TO_TIER.admin).toBe('admin');
    });

    it('should map system to system', () => {
      expect(KIND_TO_TIER.system).toBe('system');
    });

    it('should map auth to public', () => {
      expect(KIND_TO_TIER.auth).toBe('public');
    });

    it('should map storage to editor', () => {
      expect(KIND_TO_TIER.storage).toBe('editor');
    });

    it('should have entries for all capability kinds', () => {
      const kinds = Object.keys(KIND_TO_TIER).sort();
      expect(kinds).toEqual([...CAPABILITY_KINDS].sort());
    });
  });

  describe('KIND_TO_SCOPE', () => {
    it('should map mutation to write', () => {
      expect(KIND_TO_SCOPE.mutation).toBe('write');
    });

    it('should map read to read', () => {
      expect(KIND_TO_SCOPE.read).toBe('read');
    });

    it('should map search to read', () => {
      expect(KIND_TO_SCOPE.search).toBe('read');
    });

    it('should map admin to admin', () => {
      expect(KIND_TO_SCOPE.admin).toBe('admin');
    });

    it('should map system to system', () => {
      expect(KIND_TO_SCOPE.system).toBe('system');
    });

    it('should map auth to system', () => {
      expect(KIND_TO_SCOPE.auth).toBe('system');
    });

    it('should map storage to system', () => {
      expect(KIND_TO_SCOPE.storage).toBe('system');
    });

    it('should have entries for all capability kinds', () => {
      const kinds = Object.keys(KIND_TO_SCOPE).sort();
      expect(kinds).toEqual([...CAPABILITY_KINDS].sort());
    });
  });

  describe('RBAC Tier Hierarchy', () => {
    it('should have tiers in hierarchical order', () => {
      expect(RBAC_TIERS).toEqual([
        'public',
        'viewer',
        'editor',
        'manager',
        'admin',
        'system',
      ]);
    });

    it('should have all tiers used in mappings', () => {
      const usedTiers = new Set([
        ...Object.values(ACTION_FAMILY_TO_TIER),
        ...Object.values(KIND_TO_TIER),
      ]);

      // All RBAC_TIERS should be used
      for (const tier of RBAC_TIERS) {
        expect(usedTiers.has(tier)).toBe(true);
      }
    });
  });

  describe('RBAC Scope Coverage', () => {
    it('should have scopes in logical order', () => {
      expect(RBAC_SCOPES).toEqual(['read', 'write', 'admin', 'system']);
    });

    it('should have all scopes used in KIND_TO_SCOPE', () => {
      const usedScopes = new Set(Object.values(KIND_TO_SCOPE));

      // All RBAC_SCOPES should be used
      for (const scope of RBAC_SCOPES) {
        expect(usedScopes.has(scope)).toBe(true);
      }
    });
  });
});

describe('VERB_TO_KIND Mapping', () => {
  it('should have entry for every verb in CAPABILITY_VERBS', () => {
    for (const [kind, verbs] of Object.entries(CAPABILITY_VERBS)) {
      for (const verb of verbs) {
        expect(VERB_TO_KIND[verb]).toBe(kind);
      }
    }
  });

  it('should have no duplicate verbs across kinds', () => {
    const allVerbs = Object.values(CAPABILITY_VERBS).flat();
    const uniqueVerbs = new Set(allVerbs);

    expect(allVerbs.length).toBe(uniqueVerbs.size);
  });

  it('should match inferKindFromVerb results', () => {
    for (const [verb, kind] of Object.entries(VERB_TO_KIND)) {
      expect(inferKindFromVerb(verb)).toBe(kind);
    }
  });
});

describe('Capability Catalog Integrity', () => {
  it('should have all catalog keys parseable', () => {
    for (const key of Object.keys(CAPABILITY_CATALOG)) {
      expect(() => parseCapabilityKey(key)).not.toThrow();
    }
  });

  it('should have all catalog keys validatable', () => {
    for (const key of Object.keys(CAPABILITY_CATALOG)) {
      expect(() => validateCapabilityKey(key)).not.toThrow();
    }
  });

  it('should have matching key and descriptor.key', () => {
    for (const [key, descriptor] of Object.entries(CAPABILITY_CATALOG)) {
      expect(descriptor.key).toBe(key);
    }
  });

  it('should have rbacTier populated for all descriptors', () => {
    for (const descriptor of Object.values(CAPABILITY_CATALOG)) {
      expect(descriptor.rbacTier).toBeDefined();
      expect(RBAC_TIERS).toContain(descriptor.rbacTier);
    }
  });

  it('should have rbacScope populated for all descriptors', () => {
    for (const descriptor of Object.values(CAPABILITY_CATALOG)) {
      expect(descriptor.rbacScope).toBeDefined();
      expect(RBAC_SCOPES).toContain(descriptor.rbacScope);
    }
  });

  it('should have valid domains for domain-based capabilities', () => {
    for (const key of Object.keys(CAPABILITY_CATALOG)) {
      const parsed = parseCapabilityKey(key);

      if (parsed.domain) {
        expect(CAPABILITY_DOMAINS).toContain(parsed.domain);
      }
    }
  });

  it('should have valid namespaces for namespaced capabilities', () => {
    for (const key of Object.keys(CAPABILITY_CATALOG)) {
      const parsed = parseCapabilityKey(key);

      if (parsed.ns) {
        expect(CAPABILITY_NAMESPACES).toContain(parsed.ns);
      }
    }
  });
});
