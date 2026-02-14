'use client';

import { Handle, Position } from '@xyflow/react';
import {
  Bell,
  Clock,
  Code,
  FileCode,
  GitBranch,
  Globe,
  Merge,
  Play,
  Radio,
  Shield,
  ShieldCheck,
  Split,
  Square,
  UserCheck,
  Zap,
} from 'lucide-react';
import { memo } from 'react';

import type { FlowNodeData } from './flow-types';
import type { NodeProps } from '@xyflow/react';

const ICON_MAP: Record<string, React.ElementType> = {
  Play,
  Square,
  Shield,
  ShieldCheck,
  Zap,
  UserCheck,
  GitBranch,
  Split,
  Merge,
  Clock,
  Radio,
  Globe,
  Bell,
  Code,
  FileCode,
};

const NODE_COLORS: Record<string, string> = {
  start: '#22c55e',
  end: '#ef4444',
  lifecycle_gate: '#8b5cf6',
  policy_gate: '#8b5cf6',
  action: '#3b82f6',
  approval: '#f59e0b',
  condition: '#06b6d4',
  parallel_split: '#a855f7',
  parallel_join: '#a855f7',
  wait_timer: '#64748b',
  wait_event: '#64748b',
  webhook_out: '#10b981',
  notification: '#10b981',
  script: '#3b82f6',
  rule: '#6b7280',
};

const NODE_ICONS: Record<string, string> = {
  start: 'Play',
  end: 'Square',
  lifecycle_gate: 'Shield',
  policy_gate: 'ShieldCheck',
  action: 'Zap',
  approval: 'UserCheck',
  condition: 'GitBranch',
  parallel_split: 'Split',
  parallel_join: 'Merge',
  wait_timer: 'Clock',
  wait_event: 'Radio',
  webhook_out: 'Globe',
  notification: 'Bell',
  script: 'Code',
  rule: 'FileCode',
};

function WorkflowNodeComponent(props: NodeProps) {
  const data = props.data as FlowNodeData;
  const selected = props.selected;
  const nt: string = data.nodeType;
  const color = NODE_COLORS[nt] ?? '#6b7280';
  const iconName = NODE_ICONS[nt] ?? 'Zap';
  const Icon = (ICON_MAP[iconName] ?? Zap) as React.ElementType;
  const isSystem = data.isSystem;

  return (
    <div
      className={`
        group relative flex min-w-[140px] items-center gap-2.5 rounded-lg border-2 bg-background px-3 py-2.5 shadow-sm transition-all
        ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}
        ${isSystem ? 'border-dashed opacity-90' : 'border-solid'}
      `}
      style={{ borderColor: color }}
    >
      {/* Input handle */}
      {data.nodeType !== 'start' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-background !bg-muted-foreground"
        />
      )}

      {/* Icon */}
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ backgroundColor: `${color}20`, color }}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Label + meta */}
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium leading-tight">{data.label}</span>
        {data.editWindow && (
          <span className="text-[10px] leading-tight text-muted-foreground">
            {data.editWindow}
          </span>
        )}
        {isSystem && (
          <span className="text-[10px] leading-tight text-muted-foreground/60">
            system
          </span>
        )}
      </div>

      {/* Output handle */}
      {data.nodeType !== 'end' && (
        <Handle
          type="source"
          position={Position.Right}
          className="!h-3 !w-3 !border-2 !border-background !bg-muted-foreground"
        />
      )}
    </div>
  );
}

export const WorkflowNode = memo(WorkflowNodeComponent);
