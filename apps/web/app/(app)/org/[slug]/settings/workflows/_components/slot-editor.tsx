'use client';

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Badge } from 'afena-ui/components/badge';
import { Button } from 'afena-ui/components/button';
import { Save } from 'lucide-react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { EdgeConditionEditor } from './edge-condition-editor';
import { NODE_TYPE_CATALOG } from './flow-types';
import { WorkflowNode } from './workflow-node';

import type { FlowEdge, FlowNode, SlotInfo } from './flow-types';
import type { Connection, Edge, EdgeMouseHandler, NodeTypes } from '@xyflow/react';
import type { DragEvent } from 'react';

// ── Helpers ─────────────────────────────────────────────────

let nodeIdCounter = 0;
function nextNodeId(slotId: string): string {
  nodeIdCounter += 1;
  return `usr:${slotId}:${nodeIdCounter.toString(36)}`;
}

function nextEdgeId(): string {
  nodeIdCounter += 1;
  return `edge-${nodeIdCounter.toString(36)}`;
}

// ── Props ───────────────────────────────────────────────────

interface SlotEditorProps {
  slot: SlotInfo;
  initialNodes: FlowNode[];
  initialEdges: FlowEdge[];
  onSave: ((nodes: FlowNode[], edges: FlowEdge[]) => void) | null;
  readOnly: boolean;
}

// ── Custom node types registry ──────────────────────────────

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
};

// ── Component ───────────────────────────────────────────────

export function SlotEditor({
  slot,
  initialNodes,
  initialEdges,
  onSave,
  readOnly = false,
}: SlotEditorProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<FlowEdge | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (connection: Connection) => {
      if (readOnly) return;
      setEdges((eds: Edge[]) =>
        addEdge(
          {
            ...connection,
            id: nextEdgeId(),
            type: 'smoothstep',
            animated: true,
          },
          eds,
        ),
      );
    },
    [readOnly, setEdges],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      if (readOnly) return;

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      const meta = NODE_TYPE_CATALOG[nodeType];
      if (!meta || meta.isSystem) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: FlowNode = {
        id: nextNodeId(slot.slotId),
        type: 'workflowNode',
        position,
        data: {
          nodeType,
          label: meta.label,
          editWindow: slot.defaultEditWindow,
          isSystem: false,
          slotId: slot.slotId,
          provenance: slot.slotId,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [readOnly, screenToFlowPosition, slot, setNodes],
  );

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      if (readOnly) return;
      setSelectedEdge(edge as FlowEdge);
    },
    [readOnly],
  );

  const handleEdgeUpdate = useCallback(
    (edgeId: string, updates: { label?: string; condition?: { type: string; params: Record<string, unknown> }; priority?: number }) => {
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id !== edgeId) return e;
          return {
            ...e,
            label: updates.label ?? e.label,
            data: {
              ...((e.data ?? {}) as Record<string, unknown>),
              ...(updates.label ? { label: updates.label } : {}),
              ...(updates.condition ? { condition: updates.condition } : {}),
              ...(updates.priority !== undefined ? { priority: updates.priority } : {}),
            },
          } as Edge;
        }),
      );
    },
    [setEdges],
  );

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(nodes, edges);
    }
  }, [nodes, edges, onSave]);

  const isDirty = useMemo(() => {
    return (
      JSON.stringify(nodes.map((n) => ({ id: n.id, position: n.position, data: n.data }))) !==
      JSON.stringify(initialNodes.map((n) => ({ id: n.id, position: n.position, data: n.data })))
    );
  }, [nodes, initialNodes]);

  return (
    <div className="flex h-full flex-col">
      {/* Slot header */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{slot.slotId}</span>
          <Badge variant="outline" className="text-[10px]">
            {slot.defaultEditWindow}
          </Badge>
          {slot.stableRegion && (
            <Badge variant="secondary" className="text-[10px]">
              stable region
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-xs text-muted-foreground">Unsaved changes</span>
          )}
          {!readOnly && onSave && (
            <Button size="sm" variant="default" onClick={handleSave} disabled={!isDirty}>
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Save Slot
            </Button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div ref={reactFlowWrapper} className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          {...(!readOnly && {
            onNodesChange,
            onEdgesChange,
            onConnect,
            onDrop,
            onDragOver,
          })}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
          }}
          fitView
          snapToGrid
          snapGrid={[16, 16]}
          {...(!readOnly && { onEdgeClick })}
          deleteKeyCode={readOnly ? null : 'Delete'}
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          <Controls showInteractive={!readOnly} />
          <MiniMap
            className="!bottom-4 !right-4"
            nodeStrokeWidth={3}
            pannable
            zoomable
          />

          {/* Entry/exit pin labels */}
          <Panel position="top-left">
            <div className="flex flex-col gap-1">
              <Badge variant="outline" className="text-[10px]">
                Entry: {slot.entryNodeId}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                Exit: {slot.exitNodeId}
              </Badge>
            </div>
          </Panel>

          {readOnly && (
            <Panel position="top-center">
              <Badge variant="secondary">Read Only</Badge>
            </Panel>
          )}

          {selectedEdge && !readOnly && (
            <Panel position="top-right">
              <EdgeConditionEditor
                edge={selectedEdge}
                onUpdate={handleEdgeUpdate}
                onClose={() => setSelectedEdge(null)}
              />
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
