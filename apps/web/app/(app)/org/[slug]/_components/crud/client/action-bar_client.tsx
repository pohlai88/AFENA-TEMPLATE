'use client';

import { Separator } from 'afenda-ui/components/separator';
import { useState } from 'react';


import { ActionButton } from './action-button_client';
import { ConfirmActionDialog } from './confirm-action-dialog_client';
import { UpdateModeDialog } from './update-mode-dialog_client';

import type { ActionKind, ResolvedAction, ResolvedActions } from 'afenda-canon';

interface ActionBarProps {
  actions: ResolvedActions;
  onAction: (kind: ActionKind, opts?: { updateMode?: string; reason?: string }) => void;
  pending?: boolean;
}

export function ActionBar({ actions, onAction, pending }: ActionBarProps) {
  const [confirmAction, setConfirmAction] = useState<ResolvedAction | null>(null);
  const [showUpdateModes, setShowUpdateModes] = useState(false);

  const hasPrimary = actions.primary.length > 0;
  const hasSecondary = actions.secondary.length > 0;
  const hasWorkflow = actions.workflow.length > 0;

  function handleClick(action: ResolvedAction) {
    if (action.kind === 'update' && actions.updateModes.length > 0) {
      setShowUpdateModes(true);
      return;
    }
    if (action.requiresConfirm || action.requiresReason) {
      setConfirmAction(action);
      return;
    }
    onAction(action.kind);
  }

  return (
    <div className="flex items-center gap-2">
      {/* Primary actions */}
      {actions.primary.map((a) => (
        <ActionButton
          key={a.kind}
          action={a}
          onClick={() => handleClick(a)}
          disabled={pending}
        />
      ))}

      {/* Secondary actions */}
      {hasSecondary && hasPrimary && (
        <Separator orientation="vertical" className="mx-1 h-6" />
      )}
      {actions.secondary.map((a) => (
        <ActionButton
          key={a.kind}
          action={a}
          onClick={() => handleClick(a)}
          disabled={pending}
        />
      ))}

      {/* Workflow decisions */}
      {hasWorkflow && (hasPrimary || hasSecondary) && (
        <Separator orientation="vertical" className="mx-1 h-6" />
      )}
      {actions.workflow.map((a) => (
        <ActionButton
          key={a.kind}
          action={a}
          onClick={() => handleClick(a)}
          disabled={pending}
        />
      ))}

      {/* Update mode dialog */}
      <UpdateModeDialog
        open={showUpdateModes}
        onOpenChange={setShowUpdateModes}
        modes={actions.updateModes}
        onSelect={(mode, reason) => {
          setShowUpdateModes(false);
          onAction('update', { updateMode: mode, ...(reason ? { reason } : {}) });
        }}
      />

      {/* Confirm dialog */}
      <ConfirmActionDialog
        action={confirmAction}
        onConfirm={(reason) => {
          if (confirmAction) {
            onAction(confirmAction.kind, reason ? { reason } : {});
          }
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}
