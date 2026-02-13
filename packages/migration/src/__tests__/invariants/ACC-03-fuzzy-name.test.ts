import { describe, it, expect } from 'vitest';

import { fuzzyMatchName, batchFuzzyMatchNames } from '../../strategies/fuzzy-name-matcher.js';

describe('ACC-03: Fuzzy name matching with Fuse.js', () => {
  const candidates = [
    { index: 0, value: 'Alice Johnson' },
    { index: 1, value: 'Bob Smith' },
    { index: 2, value: 'Charlie Brown' },
    { index: 3, value: 'Alicia Johnston' },
  ];

  it('should find exact name matches with high score', () => {
    const results = fuzzyMatchName('Alice Johnson', candidates);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.candidateValue).toBe('Alice Johnson');
    expect(results[0]!.normalizedScore).toBeGreaterThan(15);
    expect(results[0]!.explanation.matchType).toBe('fuzzy');
    expect(results[0]!.explanation.field).toBe('name');
  });

  it('should find similar names (typo tolerance)', () => {
    const results = fuzzyMatchName('Alise Johnson', candidates);
    expect(results.length).toBeGreaterThan(0);
    // Should match Alice Johnson or Alicia Johnston
    const matchedValues = results.map(r => r.candidateValue);
    expect(matchedValues).toContain('Alice Johnson');
  });

  it('should find phonetically similar names', () => {
    const results = fuzzyMatchName('Alicia Johnston', candidates);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]!.candidateValue).toBe('Alicia Johnston');
    expect(results[0]!.normalizedScore).toBe(20); // perfect match
  });

  it('should return empty for completely different names', () => {
    const results = fuzzyMatchName('Zephyr Moonstone', candidates, { threshold: 0.3 });
    // With a strict threshold, very different names should not match
    expect(results.length).toBe(0);
  });

  it('should return empty for empty input', () => {
    expect(fuzzyMatchName('', candidates)).toHaveLength(0);
    expect(fuzzyMatchName('Alice', [])).toHaveLength(0);
  });

  it('should respect custom threshold', () => {
    // Very strict threshold — only near-exact matches
    const strict = fuzzyMatchName('Alise Johnson', candidates, { threshold: 0.1 });
    // Lenient threshold — more matches
    const lenient = fuzzyMatchName('Alise Johnson', candidates, { threshold: 0.6 });
    expect(lenient.length).toBeGreaterThanOrEqual(strict.length);
  });

  it('should respect custom score weight', () => {
    const low = fuzzyMatchName('Alice Johnson', candidates, { scoreWeight: 10 });
    const high = fuzzyMatchName('Alice Johnson', candidates, { scoreWeight: 50 });
    expect(low[0]!.normalizedScore).toBeLessThanOrEqual(10);
    expect(high[0]!.normalizedScore).toBeLessThanOrEqual(50);
    expect(high[0]!.normalizedScore).toBeGreaterThan(low[0]!.normalizedScore);
  });

  it('should produce valid MatchExplanation shape', () => {
    const results = fuzzyMatchName('Bob Smith', candidates);
    expect(results.length).toBeGreaterThan(0);
    const expl = results[0]!.explanation;
    expect(expl).toHaveProperty('field');
    expect(expl).toHaveProperty('matchType');
    expect(expl).toHaveProperty('scoreContribution');
    expect(expl).toHaveProperty('legacyValue');
    expect(expl).toHaveProperty('candidateValue');
    expect(expl.matchType).toBe('fuzzy');
    expect(expl.legacyValue).toBe('Bob Smith');
    expect(expl.candidateValue).toBe('Bob Smith');
  });

  describe('batchFuzzyMatchNames', () => {
    it('should match multiple legacy names against candidates', () => {
      const legacyNames = [
        { index: 0, value: 'Alice Johnson' },
        { index: 1, value: 'Bob Smyth' },
        { index: 2, value: 'Unknown Person' },
      ];

      const resultMap = batchFuzzyMatchNames(legacyNames, candidates);

      // Alice should match
      expect(resultMap.has(0)).toBe(true);
      expect(resultMap.get(0)![0]!.candidateValue).toBe('Alice Johnson');

      // Bob Smyth should fuzzy-match Bob Smith
      expect(resultMap.has(1)).toBe(true);
      const bobMatches = resultMap.get(1)!;
      expect(bobMatches.some(m => m.candidateValue === 'Bob Smith')).toBe(true);
    });

    it('should skip empty legacy names', () => {
      const legacyNames = [
        { index: 0, value: '' },
        { index: 1, value: 'Alice Johnson' },
      ];

      const resultMap = batchFuzzyMatchNames(legacyNames, candidates);
      expect(resultMap.has(0)).toBe(false);
      expect(resultMap.has(1)).toBe(true);
    });
  });
});
