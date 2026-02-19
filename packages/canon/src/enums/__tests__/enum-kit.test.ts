import { describe, expect, it } from 'vitest';
import type { EnumTestDescriptor } from '../_enum-kit';

// Import all enum kits
import { authScopeKit } from '../auth-scope';
import { authScopeTypeKit } from '../auth-scope-type';
import { authVerbKit } from '../auth-verb';
import { channelKit } from '../channel';
import { contactTypeKit } from '../contact-type';
import { dataTypeKit } from '../data-types';
import { docStatusKit } from '../doc-status';
import { fieldSourceKit } from '../field-source';
import { fieldSourceTypeKit } from '../field-source-type';
import { fxSourceKit } from '../fx-source';
import { governorPresetKit } from '../governor-preset';
import { metaAliasScopeTypeKit } from '../meta-alias-scope-type';
import { metaAliasTargetTypeKit } from '../meta-alias-target-type';
import { metaAssetTypeKit } from '../meta-asset-type';
import { metaClassificationKit } from '../meta-classification';
import { metaEdgeTypeKit } from '../meta-edge-type';
import { metaQualityTierKit } from '../meta-quality-tier';
import { paymentStatusKit } from '../payment-status';
import { siteTypeKit } from '../site-type';
import { storageModeKit } from '../storage-mode';
import { uomTypeKit } from '../uom-type';
import { updateModeKit } from '../update-mode';
import { viewTypeKit } from '../view-type';

/**
 * Table-driven test suite for all enum kits.
 * 
 * This suite validates that all enums follow the SSOT pattern correctly:
 * - Validation helpers work correctly
 * - Metadata is complete and type-safe
 * - Labels are derived from metadata
 * - All standard helpers are present
 */

const enumDescriptors: EnumTestDescriptor<any, any>[] = [
  {
    name: 'AuthScope',
    kit: authScopeKit,
    invalidSamples: ['invalid', 'unknown', 123, null, undefined, {}, []],
  },
  {
    name: 'AuthScopeType',
    kit: authScopeTypeKit,
    invalidSamples: ['invalid', 123, null, undefined],
  },
  {
    name: 'AuthVerb',
    kit: authVerbKit,
    invalidSamples: ['invalid', 'remove', 123, null, undefined],
  },
  {
    name: 'Channel',
    kit: channelKit,
    invalidSamples: ['invalid', 'email', 123, null, undefined],
  },
  {
    name: 'ContactType',
    kit: contactTypeKit,
    invalidSamples: ['invalid', 'partner', 123, null, undefined],
  },
  {
    name: 'DataType',
    kit: dataTypeKit,
    invalidSamples: ['invalid', 'string', 'number', 123, null, undefined],
  },
  {
    name: 'DocStatus',
    kit: docStatusKit,
    invalidSamples: ['invalid', 'pending', 'approved', 123, null, undefined],
  },
  {
    name: 'FieldSource',
    kit: fieldSourceKit,
    invalidSamples: ['invalid', 'manual', 123, null, undefined],
  },
  {
    name: 'FieldSourceType',
    kit: fieldSourceTypeKit,
    invalidSamples: ['invalid', 'plugin', 123, null, undefined],
  },
  {
    name: 'FxSource',
    kit: fxSourceKit,
    invalidSamples: ['invalid', 'api', 123, null, undefined],
  },
  {
    name: 'GovernorPreset',
    kit: governorPresetKit,
    invalidSamples: ['invalid', 'batch', 123, null, undefined],
  },
  {
    name: 'MetaAliasScopeType',
    kit: metaAliasScopeTypeKit,
    invalidSamples: ['invalid', 'global', 123, null, undefined],
  },
  {
    name: 'MetaAliasTargetType',
    kit: metaAliasTargetTypeKit,
    invalidSamples: ['invalid', 'field', 123, null, undefined],
  },
  {
    name: 'MetaAssetType',
    kit: metaAssetTypeKit,
    invalidSamples: ['invalid', 'dashboard', 123, null, undefined],
  },
  {
    name: 'MetaClassification',
    kit: metaClassificationKit,
    invalidSamples: ['invalid', 'confidential', 123, null, undefined],
  },
  {
    name: 'MetaEdgeType',
    kit: metaEdgeTypeKit,
    invalidSamples: ['invalid', 'references', 123, null, undefined],
  },
  {
    name: 'MetaQualityTier',
    kit: metaQualityTierKit,
    invalidSamples: ['invalid', 'platinum', 123, null, undefined],
  },
  {
    name: 'PaymentStatus',
    kit: paymentStatusKit,
    invalidSamples: ['invalid', 'pending', 123, null, undefined],
  },
  {
    name: 'SiteType',
    kit: siteTypeKit,
    invalidSamples: ['invalid', 'store', 123, null, undefined],
  },
  {
    name: 'StorageMode',
    kit: storageModeKit,
    invalidSamples: ['invalid', 'cached', 123, null, undefined],
  },
  {
    name: 'UomType',
    kit: uomTypeKit,
    invalidSamples: ['invalid', 'temperature', 123, null, undefined],
  },
  {
    name: 'UpdateMode',
    kit: updateModeKit,
    invalidSamples: ['invalid', 'update', 123, null, undefined],
  },
  {
    name: 'ViewType',
    kit: viewTypeKit,
    invalidSamples: ['invalid', 'grid', 123, null, undefined],
  },
];

describe('Enum Kit - Standard Behavior', () => {
  enumDescriptors.forEach(({ name, kit, invalidSamples = [] }) => {
    describe(name, () => {
      it('isValid returns true for all declared values', () => {
        kit.values.forEach((value: any) => {
          expect(kit.isValid(value)).toBe(true);
        });
      });

      it('isValid returns false for invalid samples', () => {
        invalidSamples.forEach((value) => {
          expect(kit.isValid(value)).toBe(false);
        });
      });

      it('assert does not throw for valid values', () => {
        kit.values.forEach((value: any) => {
          expect(() => kit.assert(value)).not.toThrow();
        });
      });

      it('assert throws TypeError for invalid samples', () => {
        invalidSamples.forEach((value) => {
          expect(() => kit.assert(value)).toThrow(TypeError);
          expect(() => kit.assert(value)).toThrow(/Invalid enum value/);
        });
      });

      it('labels cover all values', () => {
        const labelKeys = Object.keys(kit.labels).sort();
        const values = [...kit.values].sort();
        expect(labelKeys).toEqual(values);
      });

      it('metadata covers all values', () => {
        const metadataKeys = Object.keys(kit.metadata).sort();
        const values = [...kit.values].sort();
        expect(metadataKeys).toEqual(values);
      });

      it('all metadata has required base fields', () => {
        kit.values.forEach((value: any) => {
          const meta = kit.getMeta(value);
          expect(meta).toHaveProperty('label');
          expect(meta).toHaveProperty('description');
          expect(typeof meta.label).toBe('string');
          expect(typeof meta.description).toBe('string');
          expect(meta.label.length).toBeGreaterThan(0);
          expect(meta.description.length).toBeGreaterThan(0);
        });
      });

      it('getLabel returns correct label from metadata', () => {
        kit.values.forEach((value: any) => {
          const label = kit.getLabel(value);
          expect(label).toBe(kit.metadata[value].label);
        });
      });

      it('labels map matches metadata labels (SSOT verification)', () => {
        kit.values.forEach((value: any) => {
          expect(kit.labels[value]).toBe(kit.metadata[value].label);
        });
      });

      it('valueSet contains all values for O(1) lookup', () => {
        kit.values.forEach((value: any) => {
          expect(kit.valueSet.has(value)).toBe(true);
        });
      });

      it('getActive filters out deprecated values', () => {
        const active = kit.getActive();
        active.forEach((value: any) => {
          expect(kit.metadata[value].deprecated).toBeFalsy();
        });
      });

      it('getSorted returns values in sortOrder', () => {
        const sorted = kit.getSorted();
        expect(sorted.length).toBe(kit.values.length);
        
        // Verify order is maintained
        for (let i = 1; i < sorted.length; i++) {
          const prevOrder = kit.metadata[sorted[i - 1]].sortOrder ?? 999;
          const currOrder = kit.metadata[sorted[i]].sortOrder ?? 999;
          expect(prevOrder).toBeLessThanOrEqual(currOrder);
        }
      });
    });
  });
});

describe('Enum Kit - Performance', () => {
  it('isValid uses Set for O(1) lookup', () => {
    const kit = docStatusKit;
    const iterations = 10000;
    
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      kit.isValid('draft');
      kit.isValid('invalid');
    }
    const duration = performance.now() - start;
    
    // Should complete very quickly (< 10ms for 10k iterations)
    expect(duration).toBeLessThan(10);
  });
});

describe('Enum Kit - Destructuring Safety', () => {
  it('helpers work when destructured', () => {
    const { isValid, assert, getLabel, getMeta } = docStatusKit;
    
    // All should work without 'this' context
    expect(isValid('draft')).toBe(true);
    expect(() => assert('draft')).not.toThrow();
    expect(getLabel('draft')).toBe('Draft');
    expect(getMeta('draft')).toHaveProperty('label');
  });
});
