'use client';

import { useRouter } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'afena-ui/components/dialog';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import { deleteContact } from '@/app/actions/contacts';

interface DeleteContactButtonProps {
  contactId: string;
  contactName: string;
  version: number;
  orgSlug: string;
}

export function DeleteContactButton({
  contactId,
  contactName,
  version,
  orgSlug,
}: DeleteContactButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deleteContact(contactId, version);
    setPending(false);

    if (result.ok) {
      setOpen(false);
      router.push(`/org/${orgSlug}/contacts`);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete contact?</DialogTitle>
          <DialogDescription>
            This will soft-delete <strong>{contactName}</strong>. You can restore it
            from the trash later.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={pending}>Cancel</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={() => void handleDelete()}
            disabled={pending}
          >
            {pending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
