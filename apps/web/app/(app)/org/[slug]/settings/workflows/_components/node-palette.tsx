'use client';

import {
  Bell,
  Clock,
  Code,
  FileCode,
  GitBranch,
  Globe,
  Merge,
  Radio,
  Split,
  UserCheck,
  Zap,
} from 'lucide-react';

import type { DragEvent } from 'react';

const PALETTE_ITEMS = [
  {
    category: 'Flow Control',
    items: [
      { type: 'action', label: 'Action', icon: Zap, color: '#3b82f6', description: 'Call mutate()' },
      { type: 'condition', label: 'Condition', icon: GitBranch, color: '#06b6d4', description: 'Branch on DSL' },
      { type: 'parallel_split', label: 'Split', icon: Split, color: '#a855f7', description: 'Fork parallel' },
      { type: 'parallel_join', label: 'Join', icon: Merge, color: '#a855f7', description: 'Wait for tokens' },
      { type: 'script', label: 'Script', icon: Code, color: '#3b82f6', description: 'DSL expression' },
      { type: 'rule', label: 'Rule (V1)', icon: FileCode, color: '#6b7280', description: 'V1 bridge' },
    ],
  },
  {
    category: 'Approval',
    items: [
      { type: 'approval', label: 'Approval', icon: UserCheck, color: '#f59e0b', description: 'Version-pinned' },
    ],
  },
  {
    category: 'Wait',
    items: [
      { type: 'wait_timer', label: 'Timer', icon: Clock, color: '#64748b', description: 'Duration/datetime' },
      { type: 'wait_event', label: 'Event', icon: Radio, color: '#64748b', description: 'External event' },
    ],
  },
  {
    category: 'Integration',
    items: [
      { type: 'webhook_out', label: 'Webhook', icon: Globe, color: '#10b981', description: 'HTTP POST' },
      { type: 'notification', label: 'Notify', icon: Bell, color: '#10b981', description: 'Email/SMS/In-app' },
    ],
  },
];

function onDragStart(event: DragEvent, nodeType: string) {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
}

export function NodePalette() {
  return (
    <div className="flex h-full w-56 flex-col border-r bg-muted/30">
      <div className="border-b px-3 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Node Palette
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {PALETTE_ITEMS.map((group) => (
          <div key={group.category} className="mb-3">
            <p className="mb-1.5 px-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {group.category}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.type}
                    role="button"
                    tabIndex={0}
                    draggable
                    onDragStart={(e) => onDragStart(e, item.type)}
                    className="flex cursor-grab items-center gap-2 rounded-md border border-transparent bg-background px-2 py-1.5 shadow-sm transition-all hover:border-border hover:shadow-md active:cursor-grabbing"
                  >
                    <div
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium leading-tight">{item.label}</span>
                      <span className="text-[10px] leading-tight text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t px-3 py-2">
        <p className="text-[10px] text-muted-foreground">
          Drag nodes into the slot canvas. System nodes (start, end, gates) cannot be added or removed.
        </p>
      </div>
    </div>
  );
}
