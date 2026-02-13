'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { useCallback, useMemo, useState } from 'react';

import { updateWorkflowDefinition } from '../../../../../../../actions/workflows';
import { NodePalette } from '../../_components/node-palette';
import { SlotEditor } from '../../_components/slot-editor';

import type { FlowEdge, FlowNode, SlotInfo } from '../../_components/flow-types';

// ── Props ───────────────────────────────────────────────────

interface EditorShellProps {
  definitionId: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  nodesJson: unknown[];
  edgesJson: unknown[];
  slotsJson: unknown[];
}

// ── Safe accessor for unknown record values ─────────────────

function str(val: unknown, fallback = ''): string {
  return typeof val === 'string' ? val : fallback;
}

function num(val: unknown, fallback = 0): number {
  return typeof val === 'number' ? val : fallback;
}

// ── Helpers: convert raw JSON to React Flow structures ──────

const SYSTEM_TYPES = new Set(['start', 'end', 'lifecycle_gate', 'policy_gate']);

function rawNodesToFlow(nodesJson: unknown[], slotsJson: unknown[]): FlowNode[] {
  const slotMap = new Map<string, string>();
  for (const raw of slotsJson) {
    const s = raw as Record<string, unknown>;
    const slotId = str(s['slotId']);
    const entry = str(s['entryNodeId']);
    const exit = str(s['exitNodeId']);
    if (entry) slotMap.set(entry, slotId);
    if (exit) slotMap.set(exit, slotId);
  }

  let x = 0;
  return (nodesJson as Array<Record<string, unknown>>).map((n): FlowNode => {
    const nodeId = str(n['id']);
    const nodeType = str(n['type'], 'action');
    x += 200;
    const isSys = SYSTEM_TYPES.has(nodeType);

    return {
      id: nodeId,
      type: 'workflowNode',
      position: { x, y: 100 },
      data: {
        nodeType,
        label: str(n['label'], nodeType),
        isSystem: isSys,
      },
    };
  });
}

function rawEdgesToFlow(edgesJson: unknown[]): FlowEdge[] {
  return (edgesJson as Array<Record<string, unknown>>).map((e): FlowEdge => ({
    id: str(e['id']),
    source: str(e['sourceNodeId'], str(e['source'])),
    target: str(e['targetNodeId'], str(e['target'])),
    type: 'smoothstep',
    animated: true,
    data: {
      priority: num(e['priority']),
    },
  }));
}

function extractSlots(slotsJson: unknown[]): SlotInfo[] {
  return (slotsJson as Array<Record<string, unknown>>).map((s): SlotInfo => ({
    slotId: str(s['slotId']),
    entryNodeId: str(s['entryNodeId']),
    exitNodeId: str(s['exitNodeId']),
    defaultEditWindow: str(s['defaultEditWindow'], 'editable'),
    stableRegion: Boolean(s['stableRegion']),
    nodeCount: 0,
    edgeCount: 0,
  }));
}

// ── Component ───────────────────────────────────────────────

export function EditorShell({
  definitionId,
  version,
  status,
  nodesJson,
  edgesJson,
  slotsJson,
}: EditorShellProps) {
  const isReadOnly = status !== 'draft';

  const flowNodes = useMemo(() => rawNodesToFlow(nodesJson, slotsJson), [nodesJson, slotsJson]);
  const flowEdges = useMemo(() => rawEdgesToFlow(edgesJson), [edgesJson]);
  const slots = useMemo(() => extractSlots(slotsJson), [slotsJson]);

  const [activeSlotIdx, setActiveSlotIdx] = useState(0);

  const activeSlot: SlotInfo = slots[activeSlotIdx] ?? {
    slotId: 'full-graph',
    entryNodeId: '',
    exitNodeId: '',
    defaultEditWindow: 'editable',
    stableRegion: false,
    nodeCount: flowNodes.length,
    edgeCount: flowEdges.length,
  };

  const handleSave = useCallback(
    (nodes: FlowNode[], edges: FlowEdge[]) => {
      const rawNodes = nodes.map((n) => ({
        id: n.id,
        type: n.data.nodeType,
        label: n.data.label,
      }));
      const rawEdges = edges.map((e) => ({
        id: e.id,
        sourceNodeId: e.source,
        targetNodeId: e.target,
        priority: e.data?.priority ?? 0,
      }));

      void updateWorkflowDefinition(definitionId, version, {
        nodesJson: rawNodes,
        edgesJson: rawEdges,
      });
    },
    [definitionId, version],
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      {!isReadOnly && <NodePalette />}

      <div className="flex flex-1 flex-col">
        {slots.length > 1 && (
          <div className="flex gap-1 border-b bg-muted/20 px-3 py-1.5">
            {slots.map((s, idx) => (
              <button
                key={s.slotId}
                type="button"
                onClick={() => setActiveSlotIdx(idx)}
                className={`rounded-md px-2.5 py-1 text-xs transition-colors ${idx === activeSlotIdx
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent'
                  }`}
              >
                {s.slotId}
              </button>
            ))}
          </div>
        )}

        <ReactFlowProvider>
          <SlotEditor
            slot={activeSlot}
            initialNodes={flowNodes}
            initialEdges={flowEdges}
            onSave={isReadOnly ? null : handleSave}
            readOnly={isReadOnly}
          />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
