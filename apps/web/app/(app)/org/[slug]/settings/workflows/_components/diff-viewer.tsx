'use client';

import { Badge } from 'afena-ui/components/badge';
import { Card, CardContent, CardHeader, CardTitle } from 'afena-ui/components/card';
import { GitCompare, Minus, Plus } from 'lucide-react';

// ── Types ───────────────────────────────────────────────────

interface DiffEntry {
  type: 'added' | 'removed' | 'modified';
  kind: 'node' | 'edge';
  id: string;
  label: string;
  slotId: string;
  details?: string;
}

interface DiffViewerProps {
  fromVersion: number;
  toVersion: number;
  diffs: DiffEntry[];
}

// ── Component ───────────────────────────────────────────────

export function DiffViewer({ fromVersion, toVersion, diffs }: DiffViewerProps) {
  const grouped = new Map<string, DiffEntry[]>();
  for (const d of diffs) {
    const existing = grouped.get(d.slotId) ?? [];
    existing.push(d);
    grouped.set(d.slotId, existing);
  }

  const added = diffs.filter((d) => d.type === 'added').length;
  const removed = diffs.filter((d) => d.type === 'removed').length;
  const modified = diffs.filter((d) => d.type === 'modified').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <GitCompare className="h-4 w-4" />
          Diff: v{fromVersion} → v{toVersion}
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[10px] text-green-600">
            +{added} added
          </Badge>
          <Badge variant="outline" className="text-[10px] text-red-600">
            -{removed} removed
          </Badge>
          <Badge variant="outline" className="text-[10px] text-amber-600">
            ~{modified} modified
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {diffs.length === 0 ? (
          <p className="py-4 text-center text-xs text-muted-foreground">
            No differences found between versions.
          </p>
        ) : (
          <div className="space-y-3">
            {Array.from(grouped.entries()).map(([slotId, entries]) => (
              <div key={slotId}>
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {slotId === 'envelope' ? 'System Envelope' : slotId}
                </p>
                <div className="space-y-0.5">
                  {entries.map((entry) => (
                    <div
                      key={`${entry.kind}-${entry.id}`}
                      className={`flex items-center gap-2 rounded px-2 py-1 text-xs ${
                        entry.type === 'added'
                          ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                          : entry.type === 'removed'
                            ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                            : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {entry.type === 'added' && <Plus className="h-3 w-3" />}
                      {entry.type === 'removed' && <Minus className="h-3 w-3" />}
                      {entry.type === 'modified' && <span className="text-[10px]">~</span>}
                      <Badge variant="outline" className="text-[10px]">
                        {entry.kind}
                      </Badge>
                      <span className="font-medium">{entry.label}</span>
                      {entry.details && (
                        <span className="text-muted-foreground">({entry.details})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type { DiffEntry };
