import { describe, expect, it } from 'vitest';

import type { BodySlot, SlotGraphPatch } from '../types';
import { validateSlotPatch } from '../slot-validator';

const slot: BodySlot = {
  slotId: 'slot:pre_submit',
  entryNodeId: 'sys:start',
  exitNodeId: 'sys:gate:submit',
  defaultEditWindow: 'editable',
  stableRegion: false,
};

describe('validateSlotPatch (WF-06)', () => {
  it('accepts valid patch with correct namespace', () => {
    const patch: SlotGraphPatch = {
      nodes: [{ id: 'usr:slot:pre_submit:check', type: 'condition' }],
      edges: [
        { id: 'usr:slot:pre_submit:e1', sourceNodeId: 'sys:start', targetNodeId: 'usr:slot:pre_submit:check' },
        { id: 'usr:slot:pre_submit:e2', sourceNodeId: 'usr:slot:pre_submit:check', targetNodeId: 'sys:gate:submit' },
      ],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = validateSlotPatch('slot:pre_submit', patch, slot);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects node with wrong namespace prefix', () => {
    const patch: SlotGraphPatch = {
      nodes: [{ id: 'wrong_prefix_node', type: 'action' }],
      edges: [],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = validateSlotPatch('slot:pre_submit', patch, slot);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('WF-06'))).toBe(true);
  });

  it('rejects edge targeting non-attachment system node', () => {
    const patch: SlotGraphPatch = {
      nodes: [{ id: 'usr:slot:pre_submit:node1', type: 'action' }],
      edges: [
        { id: 'usr:slot:pre_submit:e1', sourceNodeId: 'usr:slot:pre_submit:node1', targetNodeId: 'sys:end' },
      ],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = validateSlotPatch('slot:pre_submit', patch, slot);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('not a slot attachment point'))).toBe(true);
  });

  it('rejects edge sourcing from non-attachment system node', () => {
    const patch: SlotGraphPatch = {
      nodes: [{ id: 'usr:slot:pre_submit:node1', type: 'action' }],
      edges: [
        { id: 'usr:slot:pre_submit:e1', sourceNodeId: 'sys:end', targetNodeId: 'usr:slot:pre_submit:node1' },
      ],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = validateSlotPatch('slot:pre_submit', patch, slot);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('not a slot attachment point'))).toBe(true);
  });

  it('allows edges to/from attachment points', () => {
    const patch: SlotGraphPatch = {
      nodes: [{ id: 'usr:slot:pre_submit:node1', type: 'action' }],
      edges: [
        { id: 'usr:slot:pre_submit:e1', sourceNodeId: 'sys:start', targetNodeId: 'usr:slot:pre_submit:node1' },
        { id: 'usr:slot:pre_submit:e2', sourceNodeId: 'usr:slot:pre_submit:node1', targetNodeId: 'sys:gate:submit' },
      ],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = validateSlotPatch('slot:pre_submit', patch, slot);
    expect(result.valid).toBe(true);
  });

  it('rejects looser edit window override', () => {
    const strictSlot: BodySlot = { ...slot, defaultEditWindow: 'locked' };
    const patch: SlotGraphPatch = {
      nodes: [],
      edges: [],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
      editWindowOverride: 'editable', // looser than locked
    };
    const result = validateSlotPatch('slot:pre_submit', patch, strictSlot);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('looser'))).toBe(true);
  });

  it('accepts stricter edit window override', () => {
    const patch: SlotGraphPatch = {
      nodes: [],
      edges: [],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
      editWindowOverride: 'locked', // stricter than editable
    };
    const result = validateSlotPatch('slot:pre_submit', patch, slot);
    expect(result.valid).toBe(true);
  });

  it('rejects duplicate node IDs', () => {
    const patch: SlotGraphPatch = {
      nodes: [
        { id: 'usr:slot:pre_submit:dup', type: 'action' },
        { id: 'usr:slot:pre_submit:dup', type: 'condition' },
      ],
      edges: [],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = validateSlotPatch('slot:pre_submit', patch, slot);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Duplicate node'))).toBe(true);
  });

  it('rejects duplicate edge IDs', () => {
    const patch: SlotGraphPatch = {
      nodes: [{ id: 'usr:slot:pre_submit:n1', type: 'action' }],
      edges: [
        { id: 'usr:slot:pre_submit:dup_edge', sourceNodeId: 'sys:start', targetNodeId: 'usr:slot:pre_submit:n1' },
        { id: 'usr:slot:pre_submit:dup_edge', sourceNodeId: 'usr:slot:pre_submit:n1', targetNodeId: 'sys:gate:submit' },
      ],
      entryEdgeMode: 'serial',
      exitEdgeMode: 'single',
    };
    const result = validateSlotPatch('slot:pre_submit', patch, slot);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Duplicate edge'))).toBe(true);
  });
});
