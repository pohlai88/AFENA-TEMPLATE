import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * CA-07 — BOM Explosion: Multi-Level with Waste %
 *
 * Recursively traverses a bill of materials tree, applying quantity-per and
 * waste percentages at each level to compute total material cost per finished unit.
 * Pure function — no I/O.
 */

export type BomNode = {
  itemId: string;
  name: string;
  quantityPer: number;
  wastePct: number;
  unitCostMinor: number;
  children?: BomNode[];
};

export type ExplodedLine = {
  itemId: string;
  name: string;
  level: number;
  grossQuantity: number;
  netQuantity: number;
  wasteQuantity: number;
  lineCostMinor: number;
};

export type BomExplosionResult = {
  lines: ExplodedLine[];
  totalMaterialCostMinor: number;
  totalWasteCostMinor: number;
  levels: number;
};

function explodeNode(node: BomNode, parentQty: number, level: number, lines: ExplodedLine[]): number {
  const grossQty = node.quantityPer * parentQty;
  const wasteMultiplier = 1 + node.wastePct / 100;
  const adjustedQty = grossQty * wasteMultiplier;
  const wasteQty = adjustedQty - grossQty;

  const hasChildren = node.children && node.children.length > 0;

  // Leaf nodes carry unit cost; parent nodes are assemblies (cost comes from children)
  let lineCost = 0;
  if (!hasChildren) {
    lineCost = Math.round(adjustedQty * node.unitCostMinor);
  }

  lines.push({
    itemId: node.itemId,
    name: node.name,
    level,
    grossQuantity: Math.round(grossQty * 10000) / 10000,
    netQuantity: Math.round(adjustedQty * 10000) / 10000,
    wasteQuantity: Math.round(wasteQty * 10000) / 10000,
    lineCostMinor: lineCost,
  });

  let childrenCost = 0;
  if (hasChildren) {
    for (const child of node.children!) {
      childrenCost += explodeNode(child, adjustedQty, level + 1, lines);
    }
  }

  return hasChildren ? childrenCost : lineCost;
}

export function explodeBom(
  rootNodes: BomNode[],
  finishedUnits: number,
): CalculatorResult<BomExplosionResult> {
  if (rootNodes.length === 0) throw new DomainError('VALIDATION_FAILED', 'At least one BOM root node required');
  if (finishedUnits <= 0) throw new DomainError('VALIDATION_FAILED', 'finishedUnits must be positive');

  const lines: ExplodedLine[] = [];
  let totalCost = 0;

  for (const root of rootNodes) {
    totalCost += explodeNode(root, finishedUnits, 0, lines);
  }

  const totalWaste = lines.reduce((s, l) => s + Math.round(l.wasteQuantity * (l.lineCostMinor / (l.netQuantity || 1))), 0);
  const maxLevel = lines.reduce((m, l) => Math.max(m, l.level), 0);

  return {
    result: {
      lines,
      totalMaterialCostMinor: totalCost,
      totalWasteCostMinor: totalWaste,
      levels: maxLevel + 1,
    },
    inputs: { rootCount: rootNodes.length, finishedUnits },
    explanation: `BOM explosion: ${lines.length} lines across ${maxLevel + 1} levels, total material cost=${totalCost} for ${finishedUnits} units`,
  };
}
