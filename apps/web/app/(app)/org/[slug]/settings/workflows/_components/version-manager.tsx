'use client';

import { Button } from 'afena-ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'afena-ui/components/card';
import {
  Archive,
  CheckCircle2,
  Clock,
  FileText,
  GitCompare,
  History,
  Rocket,
} from 'lucide-react';
import { useCallback, useState } from 'react';

// ── Types ───────────────────────────────────────────────────

interface DefinitionVersion {
  id: string;
  version: number;
  status: 'draft' | 'published' | 'archived';
  name: string;
  compiledHash: string | null;
  createdAt: string;
  updatedAt: string;
}

interface VersionManagerProps {
  definition: DefinitionVersion;
  versions: DefinitionVersion[];
  onPublish: (id: string, version: number) => Promise<void>;
  onArchive: (id: string, version: number) => Promise<void>;
  onSelectVersion: (version: number) => void;
  onShowDiff: (fromVersion: number, toVersion: number) => void;
}

// ── Status badge helper ─────────────────────────────────────

const STATUS_DRAFT = { color: 'text-amber-500', icon: Clock };
const STATUS_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  draft: STATUS_DRAFT,
  published: { color: 'text-green-500', icon: CheckCircle2 },
  archived: { color: 'text-muted-foreground', icon: Archive },
};

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status] ?? STATUS_DRAFT;
}

// ── Component ───────────────────────────────────────────────

export function VersionManager({
  definition,
  versions,
  onPublish,
  onArchive,
  onSelectVersion,
  onShowDiff,
}: VersionManagerProps) {
  const [publishing, setPublishing] = useState(false);
  const [archiving, setArchiving] = useState(false);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      await onPublish(definition.id, definition.version);
    } finally {
      setPublishing(false);
    }
  }, [definition, onPublish]);

  const handleArchive = useCallback(async () => {
    setArchiving(true);
    try {
      await onArchive(definition.id, definition.version);
    } finally {
      setArchiving(false);
    }
  }, [definition, onArchive]);

  const statusCfg = getStatusCfg(definition.status);
  const StatusIcon = statusCfg.icon;

  return (
    <div className="flex h-full w-64 flex-col border-l bg-muted/30">
      {/* Current version header */}
      <div className="border-b px-3 py-2.5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Version Management
        </h3>
      </div>

      {/* Current definition card */}
      <div className="border-b p-3">
        <Card>
          <CardHeader className="p-3 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4" />
              {definition.name}
            </CardTitle>
            <CardDescription className="text-xs">
              Version {definition.version}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-3 pt-0">
            <div className="flex items-center gap-1.5">
              <StatusIcon className={`h-3.5 w-3.5 ${statusCfg.color}`} />
              <span className="text-xs capitalize">{definition.status}</span>
            </div>
            {definition.compiledHash && (
              <div className="text-[10px] text-muted-foreground">
                Hash: {definition.compiledHash.slice(0, 12)}...
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              {definition.status === 'draft' && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => void handlePublish()}
                  disabled={publishing}
                >
                  <Rocket className="mr-1.5 h-3.5 w-3.5" />
                  {publishing ? 'Publishing...' : 'Publish'}
                </Button>
              )}
              {definition.status === 'published' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => void handleArchive()}
                  disabled={archiving}
                >
                  <Archive className="mr-1.5 h-3.5 w-3.5" />
                  {archiving ? 'Archiving...' : 'Archive'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Version history */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 flex items-center gap-1.5">
          <History className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Version History</span>
        </div>
        <div className="space-y-1.5">
          {versions.map((v) => {
            const vCfg = getStatusCfg(v.status);
            const VIcon = vCfg.icon;
            const isCurrent = v.version === definition.version;

            return (
              <div
                key={v.version}
                role="button"
                tabIndex={0}
                onClick={() => onSelectVersion(v.version)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectVersion(v.version);
                }}
                className={`flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-xs transition-colors hover:bg-accent ${isCurrent ? 'border-primary bg-primary/5' : 'border-transparent'
                  }`}
              >
                <VIcon className={`h-3 w-3 ${vCfg.color}`} />
                <div className="flex-1">
                  <span className="font-medium">v{v.version}</span>
                  <span className="ml-1.5 text-muted-foreground">{v.status}</span>
                </div>
                {!isCurrent && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      onShowDiff(v.version, definition.version);
                    }}
                  >
                    <GitCompare className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Diff legend */}
      <div className="border-t px-3 py-2">
        <p className="text-[10px] text-muted-foreground">
          Click a version to view. Use <GitCompare className="inline h-3 w-3" /> to compare with current.
        </p>
      </div>
    </div>
  );
}
