'use client';

import { useRouter } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { executeContactAction } from '../_server/contacts.server-actions';

import type { ActionEnvelope, ResolvedActions } from 'afena-canon';

interface TrashRestoreButtonProps {
  orgId: string;
  orgSlug: string;
  entityId: string;
  expectedVersion: number;
  actions: ResolvedActions;
}

export function TrashRestoreButton({
  orgId,
  orgSlug,
  entityId,
  expectedVersion,
  actions,
}: TrashRestoreButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const canRestore = [
    ...actions.primary,
    ...actions.secondary,
  ].some((a) => a.kind === 'restore');

  if (!canRestore) return null;

  function handleRestore() {
    const envelope: ActionEnvelope = {
      clientActionId: crypto.randomUUID(),
      orgId,
      entityType: 'contacts',
      entityId,
      kind: 'restore',
    };

    setPending(true);
    void executeContactAction(envelope, { expectedVersion, orgSlug }).then((result) => {
      setPending(false);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRestore}
      disabled={pending}
    >
      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
      {pending ? 'Restoring...' : 'Restore'}
    </Button>
  );
}
