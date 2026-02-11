'use client';

import { useRouter } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import { RotateCcw } from 'lucide-react';
import { useState } from 'react';

import { restoreContact } from '@/app/actions/contacts';

interface RestoreContactButtonProps {
  contactId: string;
  contactName: string;
  version: number;
}

export function RestoreContactButton({
  contactId,
  contactName,
  version,
}: RestoreContactButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleRestore() {
    setPending(true);
    const result = await restoreContact(contactId, version);
    setPending(false);

    if (result.ok) {
      router.refresh();
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => void handleRestore()}
      disabled={pending}
      title={`Restore ${contactName}`}
    >
      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
      {pending ? 'Restoring...' : 'Restore'}
    </Button>
  );
}
