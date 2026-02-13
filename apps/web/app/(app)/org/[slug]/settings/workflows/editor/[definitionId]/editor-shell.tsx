'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { useCallback, useMemo, useState } from 'react';

import {
  archiveWorkflowDefinition,
  publishWorkflowDefinition,
  updateWorkflowDefinition,
} from '../../../../../../../actions/workflows';
import { DiffViewer } from '../../_components/diff-viewer';
import { NodePalette } from '../../_components/node-palette';
import { SlotEditor } from '../../_components/slot-editor';
import { VersionManager } from '../../_components/version-manager';

import type { DiffEntry } from '../../_components/diff-viewer';
import type { FlowEdge, FlowNode, SlotInfo } from '../../_components/flow-types';

// ── Props ───────────────────────────────────────────────────

interface VersionRow {
  id: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  name: string;
  compiledHash: string | null;
  createdAt: string;
  updatedAt: string;
}

interface EditorShellProps {
  definitionId: string;
  name: string;
  entityType: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  nodesJson: unknown[];
  edgesJson: unknown[];
  slotsJson: unknown[];
  versions: VersionRow[];
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
  // Build a map: nodeId → slotId (from entry/exit pins + slot-prefixed IDs)
  const nodeSlotMap = new Map<string, string>();
  for (const raw of slotsJson) {
    const s = raw as Record<string, unknown>;
    const slotId = str(s['slotId']);
    const entry = str(s['entryNodeId']);
    const exit = str(s['exitNodeId']);
    if (entry) nodeSlotMap.set(entry, slotId);
    if (exit) nodeSlotMap.set(exit, slotId);
  }

  let x = 0;
  return (nodesJson as Array<Record<string, unknown>>).map((n): FlowNode => {
    const nodeId = str(n['id']);
    const nodeType = str(n['type'], 'action');
    x += 200;
    const isSys = SYSTEM_TYPES.has(nodeType);

    // Determine slot membership: explicit map, or infer from usr:slotId:xxx pattern
    let slotId = nodeSlotMap.get(nodeId) ?? '';
    if (!slotId && nodeId.startsWith('usr:')) {
      const parts = nodeId.split(':');
      if (parts.length >= 3) slotId = parts[1] ?? '';
    }

    return {
      id: nodeId,
      type: 'workflowNode',
      position: { x, y: 100 },
      data: {
        nodeType,
        label: str(n['label'], nodeType),
        isSystem: isSys,
        ...(slotId ? { slotId } : {}),
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
  name,
  // entityType is available via props but not needed in the client component
  version,
  status,
  nodesJson,
  edgesJson,
  slotsJson,
  versions,
}: EditorShellProps) {
  const isReadOnly = status !== 'draft';
  const [diffState, setDiffState] = useState<{ from: number; to: number; entries: DiffEntry[] } | null>(null);

  const flowNodes = useMemo(() => rawNodesToFlow(nodesJson, slotsJson), [nodesJson, slotsJson]);
  const flowEdges = useMemo(() => rawEdgesToFlow(edgesJson), [edgesJson]);
  const slots = useMemo(() => extractSlots(slotsJson), [slotsJson]);

  const [activeSlotIdx, setActiveSlotIdx] = useState(0);

  const activeSlot: SlotInfo = useMemo(() => slots[activeSlotIdx] ?? {
    slotId: 'full-graph',
    entryNodeId: '',
    exitNodeId: '',
    defaultEditWindow: 'editable',
    stableRegion: false,
    nodeCount: flowNodes.length,
    edgeCount: flowEdges.length,
  }, [activeSlotIdx, slots, flowNodes.length, flowEdges.length]);

  // Slot-scoped filtering: show only nodes/edges belonging to the active slot
  const { filteredNodes, filteredEdges } = useMemo(() => {
    if (activeSlot.slotId === 'full-graph' || slots.length <= 1) {
      return { filteredNodes: flowNodes, filteredEdges: flowEdges };
    }

    const slotNodeIds = new Set<string>();
    // Include entry/exit pin nodes
    if (activeSlot.entryNodeId) slotNodeIds.add(activeSlot.entryNodeId);
    if (activeSlot.exitNodeId) slotNodeIds.add(activeSlot.exitNodeId);
    // Include nodes tagged with this slot
    for (const n of flowNodes) {
      if (n.data.slotId === activeSlot.slotId) slotNodeIds.add(n.id);
    }

    const scopedNodes = flowNodes.filter((n) => slotNodeIds.has(n.id));
    const scopedEdges = flowEdges.filter(
      (e) => slotNodeIds.has(e.source) && slotNodeIds.has(e.target),
    );

    return { filteredNodes: scopedNodes, filteredEdges: scopedEdges };
  }, [activeSlot, slots, flowNodes, flowEdges]);

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

  const handlePublish = useCallback(async (id: string, ver: number) => {
    await publishWorkflowDefinition(id, ver);
    window.location.reload();
  }, []);

  const handleArchive = useCallback(async (id: string, ver: number) => {
    await archiveWorkflowDefinition(id, ver);
    window.location.reload();
  }, []);

  const handleSelectVersion = useCallback((ver: number) => {
    // Navigate to the same definition but different version
    // For now, reload with version param — future: client-side fetch
    const url = new URL(window.location.href);
    url.searchParams.set('v', String(ver));
    window.location.href = url.toString();
  }, []);

  const handleShowDiff = useCallback((fromVersion: number, toVersion: number) => {
    // Compute a simple structural diff between versions
    // For now, show a placeholder — real diff requires fetching both versions
    setDiffState({ from: fromVersion, to: toVersion, entries: [] });
  }, []);

  const currentDef: VersionRow = useMemo(() => ({
    id: definitionId,
    version,
    status,
    name,
    compiledHash: null,
    createdAt: '',
    updatedAt: '',
  }), [definitionId, version, status, name]);

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
            initialNodes={filteredNodes}
            initialEdges={filteredEdges}
            onSave={isReadOnly ? null : handleSave}
            readOnly={isReadOnly}
          />
        </ReactFlowProvider>

        {diffState && (
          <div className="border-t p-4">
            <DiffViewer
              fromVersion={diffState.from}
              toVersion={diffState.to}
              diffs={diffState.entries}
            />
          </div>
        )}
      </div>

      <VersionManager
        definition={currentDef}
        versions={versions}
        onPublish={handlePublish}
        onArchive={handleArchive}
        onSelectVersion={handleSelectVersion}
        onShowDiff={handleShowDiff}
      />
    </div>
  );
}
