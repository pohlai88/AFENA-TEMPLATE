'use client';

import { useRouter } from 'next/navigation';

import { useState } from 'react';

import { ActionBar } from '../../_components/crud/client/action-bar_client';
import { executeContactAction } from '../_server/contacts.server-actions';

import type { ActionEnvelope, ActionKind, ResolvedActions, UpdateMode } from 'afena-canon';

interface ContactDetailActionsProps {
  actions: ResolvedActions;
  orgId: string;
  orgSlug: string;
  entityId: string;
  expectedVersion: number;
}

export function ContactDetailActions({
  actions,
  orgId,
  orgSlug,
  entityId,
  expectedVersion,
}: ContactDetailActionsProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  function handleAction(
    kind: ActionKind,
    opts?: { updateMode?: string; reason?: string },
  ) {
    if (kind === 'update') {
      router.push(`/org/${orgSlug}/contacts/${entityId}/edit`);
      return;
    }

    const envelope: ActionEnvelope = {
      clientActionId: crypto.randomUUID(),
      orgId,
      entityType: 'contacts',
      entityId,
      kind,
      ...(opts?.updateMode ? { updateMode: opts.updateMode as UpdateMode } : {}),
      ...(opts?.reason ? { reason: opts.reason } : {}),
    };

    setPending(true);
    void executeContactAction(envelope, { expectedVersion, orgSlug }).then((result) => {
      setPending(false);
      if (result.ok) {
        if (kind === 'delete') {
          router.push(`/org/${orgSlug}/contacts`);
        }
        router.refresh();
      }
    });
  }

  return (
    <ActionBar
      actions={actions}
      onAction={handleAction}
      pending={pending}
    />
  );
}
