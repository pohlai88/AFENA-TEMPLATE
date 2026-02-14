'use client';

import { Badge } from 'afena-ui/components/badge';
import { Button } from 'afena-ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'afena-ui/components/card';
import { Input } from 'afena-ui/components/input';
import { Label } from 'afena-ui/components/label';
import { GitBranch, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import type { FlowEdge } from './flow-types';

// ── DSL variable hints ──────────────────────────────────────

const DSL_VARIABLES = [
  { ns: 'entity', examples: ['entity.grand_total', 'entity.vendor_id', 'entity.status'] },
  { ns: 'actor', examples: ['actor.roles', 'actor.user_id'] },
  { ns: 'org', examples: ['org.currency', 'org.id'] },
  { ns: 'context', examples: ['context.approval_count'] },
  { ns: 'now', examples: ['now'] },
];

const DSL_OPERATORS = ['==', '!=', '>', '>=', '<', '<=', 'in', 'contains', '&&', '||', '!'];

// ── Props ───────────────────────────────────────────────────

interface EdgeConditionEditorProps {
  edge: FlowEdge | null;
  onUpdate: (edgeId: string, updates: { label?: string; condition?: { type: string; params: Record<string, unknown> }; priority?: number }) => void;
  onClose: () => void;
}

// ── Component ───────────────────────────────────────────────

export function EdgeConditionEditor({ edge, onUpdate, onClose }: EdgeConditionEditorProps) {
  const [label, setLabel] = useState(edge?.data?.label ?? '');
  const [expression, setExpression] = useState(() => {
    const cond = edge?.data?.condition;
    if (!cond?.params) return '';
    const params = cond.params as Record<string, unknown>;
    return typeof params['expression'] === 'string' ? params['expression'] : '';
  });
  const [priority, setPriority] = useState(edge?.data?.priority ?? 0);

  const handleSave = useCallback(() => {
    if (!edge) return;
    onUpdate(edge.id, {
      ...(label ? { label } : {}),
      ...(expression
        ? {
          condition: {
            type: 'expression',
            params: { expression },
          },
        }
        : {}),
      priority,
    });
    onClose();
  }, [edge, label, expression, priority, onUpdate, onClose]);

  if (!edge) return null;

  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <GitBranch className="h-4 w-4" />
            Edge Condition
          </CardTitle>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={onClose}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          {edge.source} → {edge.target}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Label */}
        <div className="space-y-1">
          <Label className="text-xs">Label</Label>
          <Input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. approved, rejected, amount > 10K"
            className="h-8 text-xs"
          />
        </div>

        {/* DSL Expression */}
        <div className="space-y-1">
          <Label className="text-xs">Condition (DSL)</Label>
          <textarea
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="entity.grand_total > 10000 && actor.roles contains 'finance_manager'"
            className="h-20 w-full rounded-md border bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-[10px] text-muted-foreground">
            Typed DSL only. No JS. Max 500 chars.
          </p>
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <Label className="text-xs">Priority (lower = first)</Label>
          <Input
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
            className="h-8 text-xs"
            min={0}
          />
        </div>

        {/* Variable hints */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Available Variables</Label>
          <div className="flex flex-wrap gap-1">
            {DSL_VARIABLES.map((v) => (
              <Badge key={v.ns} variant="outline" className="text-[10px]">
                {v.ns}.*
              </Badge>
            ))}
          </div>
        </div>

        {/* Operators */}
        <div className="space-y-1">
          <Label className="text-[10px] text-muted-foreground">Operators</Label>
          <div className="flex flex-wrap gap-1">
            {DSL_OPERATORS.map((op) => (
              <Badge key={op} variant="secondary" className="font-mono text-[10px]">
                {op}
              </Badge>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
