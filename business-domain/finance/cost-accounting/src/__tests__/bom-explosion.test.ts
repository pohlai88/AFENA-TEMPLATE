import { describe, expect, it } from 'vitest';
import { explodeBom } from '../calculators/bom-explosion';
import type { BomNode } from '../calculators/bom-explosion';

describe('CA-07 — BOM Explosion', () => {
  it('explodes a single-level BOM', () => {
    const roots: BomNode[] = [
      { itemId: 'M1', name: 'Steel', quantityPer: 2, wastePct: 5, unitCostMinor: 1000, children: [] },
      { itemId: 'M2', name: 'Plastic', quantityPer: 4, wastePct: 0, unitCostMinor: 200, children: [] },
    ];
    const { result } = explodeBom(roots, 10);

    expect(result.lines).toHaveLength(2);
    // Steel: 2*10=20 gross, 20*1.05=21 adjusted, cost=21*1000=21000
    expect(result.lines[0].grossQuantity).toBe(20);
    expect(result.lines[0].netQuantity).toBe(21);
    expect(result.lines[0].lineCostMinor).toBe(21_000);
    // Plastic: 4*10=40 gross, 40*1.0=40, cost=40*200=8000
    expect(result.lines[1].lineCostMinor).toBe(8_000);
    expect(result.totalMaterialCostMinor).toBe(29_000);
  });

  it('explodes a multi-level BOM', () => {
    const roots: BomNode[] = [
      {
        itemId: 'ASM1', name: 'Assembly', quantityPer: 1, wastePct: 0, unitCostMinor: 0,
        children: [
          { itemId: 'M1', name: 'Part A', quantityPer: 3, wastePct: 10, unitCostMinor: 500 },
          { itemId: 'M2', name: 'Part B', quantityPer: 2, wastePct: 0, unitCostMinor: 300 },
        ],
      },
    ];
    const { result } = explodeBom(roots, 5);

    expect(result.levels).toBe(2);
    expect(result.lines).toHaveLength(3); // ASM1 + M1 + M2
    expect(result.lines[0].level).toBe(0);
    expect(result.lines[1].level).toBe(1);
  });

  it('returns CalculatorResult shape', () => {
    const roots: BomNode[] = [
      { itemId: 'M1', name: 'X', quantityPer: 1, wastePct: 0, unitCostMinor: 100 },
    ];
    const res = explodeBom(roots, 1);
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on empty roots', () => {
    expect(() => explodeBom([], 10)).toThrow('At least one BOM root');
  });

  it('throws on non-positive finishedUnits', () => {
    const roots: BomNode[] = [{ itemId: 'M1', name: 'X', quantityPer: 1, wastePct: 0, unitCostMinor: 100 }];
    expect(() => explodeBom(roots, 0)).toThrow('finishedUnits must be positive');
  });

  it('applies waste % correctly', () => {
    const roots: BomNode[] = [
      { itemId: 'M1', name: 'X', quantityPer: 10, wastePct: 20, unitCostMinor: 100 },
    ];
    const { result } = explodeBom(roots, 1);
    // gross=10, adjusted=10*1.2=12, waste=2, cost=12*100=1200
    expect(result.lines[0].grossQuantity).toBe(10);
    expect(result.lines[0].netQuantity).toBe(12);
    expect(result.lines[0].wasteQuantity).toBe(2);
    expect(result.lines[0].lineCostMinor).toBe(1_200);
  });
});
