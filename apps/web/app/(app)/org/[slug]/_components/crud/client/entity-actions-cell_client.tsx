'use client';

import { Button } from 'afenda-ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'afenda-ui/components/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

import type { ActionKind, ResolvedActions } from 'afenda-canon';

interface EntityActionsCellProps {
  actions: ResolvedActions;
  onAction: (kind: ActionKind) => void;
}

export function EntityActionsCell({ actions, onAction }: EntityActionsCellProps) {
  const allActions = [
    ...actions.primary,
    ...actions.secondary,
    ...actions.workflow,
  ];

  if (allActions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.primary.map((a) => (
          <DropdownMenuItem key={a.kind} onClick={() => onAction(a.kind)}>
            {a.label}
          </DropdownMenuItem>
        ))}
        {actions.secondary.length > 0 && actions.primary.length > 0 && (
          <DropdownMenuSeparator />
        )}
        {actions.secondary.map((a) => (
          <DropdownMenuItem key={a.kind} onClick={() => onAction(a.kind)}>
            {a.label}
          </DropdownMenuItem>
        ))}
        {actions.workflow.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {actions.workflow.map((a) => (
              <DropdownMenuItem key={a.kind} onClick={() => onAction(a.kind)}>
                {a.label}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
