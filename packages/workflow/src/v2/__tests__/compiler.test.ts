import { describe, expect, it } from 'vitest';

import type { BodySlot, SlotGraphPatch, WorkflowEdge, WorkflowNode } from '../types';
import { compileEffective } from '../merge-compiler';
import { validateDag } from '../dag-validator';
import { topologicalSort } from '../dag-validator';

// ── Helpers ─────────────────────────────────────────────────

function minimalEnvelope(): { nodes: WorkflowNode[]; edges: WorkflowEdge[]; slots: BodySlot[] } {
  return {
    nodes: [
      { id: 'sys:start', type: 'start', label: 'Start', editWindow: 'editable' },
      { id: 'sys:gate:submit', type: 'lifecycle_gate', label: 'Submit', editWindow: 'amend_only' },
      { id: 'sys:end', type: 'end', label: 'End', editWindow: 'locked' },
    ],
    edges: [
      { id: 'sys:edge:start_to_submit', sourceNodeId: 'sys:start', targetNodeId: 'sys:gate:submit', priority: 0 },
      { id: 'sys:edge:submit_to_end', sourceNodeId: 'sys:gate:submit', targetNodeId: 'sys:end', priority: 1 },
    ],
    slots: [
      {
        slotId: 'slot:pre_submit',
        entryNodeId: 'sys:start',
        exitNodeId: 'sys:gate:submit',
        defaultEditWindow: 'editable',
        stableRegion: false,
      },
    ],
  };
}

// ── DAG Validator ───────────────────────────────────────────

describe('validateDag', () => {
  it('accepts a valid minimal DAG', () => {
    const { nodes, edges } = minimalEnvelope();
    const result = validateDag(nodes, edges);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects DAG with no start node', () => {
    const nodes: WorkflowNode[] = [
      { id: 'sys:end', type: 'end' },
    ];
    const result = validateDag(nodes, []);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('start node'))).toBe(true);
  });

  it('rejects DAG with cycle', () => {
    const nodes: WorkflowNode[] = [
      { id: 'sys:start', type: 'start' },
      { id: 'a', type: 'action' },
      { id: 'b', type: 'action' },
      { id: 'sys:end', type: 'end' },
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1', sourceNodeId: 'sys:start', targetNodeId: 'a' },
      { id: 'e2', sourceNodeId: 'a', targetNodeId: 'b' },
      { id: 'e3', sourceNodeId: 'b', targetNodeId: 'a' }, // cycle
      { id: 'e4', sourceNodeId: 'b', targetNodeId: 'sys:end' },
    ];
    const result = validateDag(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('cycle'))).toBe(true);
  });

  it('rejects DAG with unreachable nodes', () => {
    const nodes: WorkflowNode[] = [
      { id: 'sys:start', type: 'start' },
      { id: 'sys:end', type: 'end' },
      { id: 'orphan', type: 'action' },
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1', sourceNodeId: 'sys:start', targetNodeId: 'sys:end' },
    ];
    const result = validateDag(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('unreachable'))).toBe(true);
  });

  it('rejects duplicate node IDs', () => {
    const nodes: WorkflowNode[] = [
      { id: 'sys:start', type: 'start' },
      { id: 'sys:start', type: 'start' },
      { id: 'sys:end', type: 'end' },
    ];
    const result = validateDag(nodes, [{ id: 'e1', sourceNodeId: 'sys:start', targetNodeId: 'sys:end' }]);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Duplicate node'))).toBe(true);
  });

  it('rejects edges referencing non-existent nodes', () => {
    const nodes: WorkflowNode[] = [
      { id: 'sys:start', type: 'start' },
      { id: 'sys:end', type: 'end' },
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1', sourceNodeId: 'sys:start', targetNodeId: 'ghost' },
    ];
    const result = validateDag(nodes, edges);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('non-existent'))).toBe(true);
  });
});

// ── Topological Sort (WF-13) ────────────────────────────────

describe('topologicalSort (WF-13: stable topo order)', () => {
  it('produces deterministic order with lexicographic tie-break', () => {
    const { nodes, edges } = minimalEnvelope();
    const order1 = topologicalSort(nodes, edges);
    const order2 = topologicalSort(nodes, edges);
    expect(order1).toEqual(order2);
    expect(order1).not.toBeNull();
  });

  it('returns null for cyclic graph', () => {
    const nodes: WorkflowNode[] = [
      { id: 'a', type: 'action' },
      { id: 'b', type: 'action' },
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1', sourceNodeId: 'a', targetNodeId: 'b' },
      { id: 'e2', sourceNodeId: 'b', targetNodeId: 'a' },
    ];
    expect(topologicalSort(nodes, edges)).toBeNull();
  });

  it('start comes before end', () => {
    const { nodes, edges } = minimalEnvelope();
    const order = topologicalSort(nodes, edges)!;
    expect(order.indexOf('sys:start')).toBeLessThan(order.indexOf('sys:end'));
  });
});

// ── Merge Compiler (WF-12: deterministic compile) ───────────

describe('compileEffective', () => {
  it('compiles a bare envelope with no patches', () => {
    const { nodes, edges, slots } = minimalEnvelope();
    const result = compileEffective(nodes, edges, slots, {}, 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.compiled.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.compiled.topologicalOrder).toContain('sys:start');
    expect(result.compiled.topologicalOrder).toContain('sys:end');
    expect(result.compiled.compilerVersion).toBe('1.0.0');
    expect(result.compiled.envelopeVersion).toBe(1);
  });

  it('produces identical hash for identical inputs (WF-12)', () => {
    const { nodes, edges, slots } = minimalEnvelope();
    const r1 = compileEffective(nodes, edges, slots, {}, 1);
    const r2 = compileEffective(nodes, edges, slots, {}, 1);
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (!r1.ok || !r2.ok) return;
    expect(r1.compiled.hash).toBe(r2.compiled.hash);
  });

  it('merges a slot patch into the envelope', () => {
    const { nodes, edges, slots } = minimalEnvelope();
    const patch: SlotGraphPatch = {
      nodes: [
        { id: 'usr:slot:pre_submit:validation', type: 'condition', label: 'Validate' },
      ],
      edges: [
        { id: 'usr:slot:pre_submit:e1', sourceNodeId: 'sys:start', targetNodeId: 'usr:slot:pre_submit:validation' },
        { id: 'usr:slot:pre_submit:e2', sourceNodeId: 'usr:slot:pre_submit:validation', targetNodeId: 'sys:gate:submit' },
      ],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };

    const result = compileEffective(nodes, edges, slots, { 'slot:pre_submit': patch }, 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    // Patch node should appear in slotMap
    expect(result.compiled.slotMap['usr:slot:pre_submit:validation']).toBe('slot:pre_submit');
    // Topo order should include the custom node
    expect(result.compiled.topologicalOrder).toContain('usr:slot:pre_submit:validation');
  });

  it('rejects patch for unknown slot', () => {
    const { nodes, edges, slots } = minimalEnvelope();
    const patch: SlotGraphPatch = {
      nodes: [],
      edges: [],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = compileEffective(nodes, edges, slots, { 'slot:nonexistent': patch }, 1);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes('unknown slot'))).toBe(true);
  });

  it('rejects patch with WF-06 namespace violation', () => {
    const { nodes, edges, slots } = minimalEnvelope();
    const patch: SlotGraphPatch = {
      nodes: [
        { id: 'bad_namespace_node', type: 'action' }, // Missing usr:slot:pre_submit: prefix
      ],
      edges: [],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = compileEffective(nodes, edges, slots, { 'slot:pre_submit': patch }, 1);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.some((e) => e.includes('WF-06'))).toBe(true);
  });

  it('includes system gate integrity check (WF-08)', () => {
    const { nodes, edges, slots } = minimalEnvelope();
    const result = compileEffective(nodes, edges, slots, {}, 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.compiled.systemGateIntegrity.valid).toBe(true);
    expect(result.compiled.systemGateIntegrity.requiredGates).toContain('sys:start');
    expect(result.compiled.systemGateIntegrity.requiredGates).toContain('sys:end');
  });

  it('marks stable region nodes from slot config (WF-05)', () => {
    const nodes: WorkflowNode[] = [
      { id: 'sys:start', type: 'start', editWindow: 'editable' },
      { id: 'sys:gate:approve', type: 'lifecycle_gate', editWindow: 'locked' },
      { id: 'sys:end', type: 'end', editWindow: 'locked' },
    ];
    const edges: WorkflowEdge[] = [
      { id: 'e1', sourceNodeId: 'sys:start', targetNodeId: 'sys:gate:approve', priority: 0 },
      { id: 'e2', sourceNodeId: 'sys:gate:approve', targetNodeId: 'sys:end', priority: 1 },
    ];
    const stableSlots: BodySlot[] = [
      {
        slotId: 'slot:approval',
        entryNodeId: 'sys:start',
        exitNodeId: 'sys:gate:approve',
        defaultEditWindow: 'amend_only',
        stableRegion: true, // This slot is stable
      },
    ];

    const patch: SlotGraphPatch = {
      nodes: [{ id: 'usr:slot:approval:check', type: 'condition' }],
      edges: [
        { id: 'usr:slot:approval:e1', sourceNodeId: 'sys:start', targetNodeId: 'usr:slot:approval:check' },
        { id: 'usr:slot:approval:e2', sourceNodeId: 'usr:slot:approval:check', targetNodeId: 'sys:gate:approve' },
      ],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };

    const result = compileEffective(nodes, edges, stableSlots, { 'slot:approval': patch }, 1);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.compiled.stableRegionNodes).toContain('usr:slot:approval:check');
  });
});
