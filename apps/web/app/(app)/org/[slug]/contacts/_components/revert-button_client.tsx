'use client';

import { useRouter } from 'next/navigation';

import { Button } from 'afenda-ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'afenda-ui/components/dialog';
import { Undo2 } from 'lucide-react';
import { useState } from 'react';

import { executeContactAction } from '../_server/contacts.server-actions';

import type { ActionEnvelope } from 'afenda-canon';

interface RevertButtonProps {
  contactId: string;
  contactName: string;
  targetVersion: number;
  currentVersion: number;
  snapshot: Record<string, unknown>;
  orgSlug: string;
  orgId: string;
}

export function RevertButton({
  contactId,
  contactName,
  targetVersion,
  currentVersion,
  snapshot,
  orgSlug,
  orgId,
}: RevertButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRevert() {
    setPending(true);
    setError(null);

    const input: Record<string, string> = {};
    const mutableFields = ['name', 'email', 'phone', 'company', 'notes'];
    for (const field of mutableFields) {
      const val = snapshot[field];
      if (val != null && typeof val === 'string') {
        input[field] = val;
      }
    }

    if (!input['name']) {
      setError('Cannot revert: snapshot missing required "name" field');
      setPending(false);
      return;
    }

    const envelope: ActionEnvelope = {
      clientActionId: crypto.randomUUID(),
      orgId,
      entityType: 'contacts',
      entityId: contactId,
      kind: 'update',
    };

    const result = await executeContactAction(envelope, {
      input,
      expectedVersion: currentVersion,
      orgSlug,
    });

    setPending(false);

    if (result.ok) {
      setOpen(false);
      router.push(`/org/${orgSlug}/contacts/${contactId}`);
      router.refresh();
    } else {
      setError(result.error?.message ?? 'Failed to revert');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Undo2 className="mr-1.5 h-3.5 w-3.5" />
          Revert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Revert to version {targetVersion}?</DialogTitle>
          <DialogDescription>
            This will update <strong>{contactName}</strong> to match the state
            from version {targetVersion}. A new version will be created
            (v{currentVersion} → v{currentVersion + 1}).
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => void handleRevert()}
            disabled={pending}
          >
            {pending ? 'Reverting...' : `Revert to v${targetVersion}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
