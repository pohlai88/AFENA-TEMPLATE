'use client';

import { useRouter } from 'next/navigation';

import { Button } from 'afena-ui/components/button';
import { Card, CardContent, CardFooter } from 'afena-ui/components/card';
import { Input } from 'afena-ui/components/input';
import { Label } from 'afena-ui/components/label';
import { useState, useTransition } from 'react';

import { createRole } from '@/app/actions/roles';

interface NewRoleFormProps {
  orgSlug: string;
}

export function NewRoleForm({ orgSlug }: NewRoleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [key, setKey] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!key || !name) return;
    setError(null);

    startTransition(async () => {
      const result = await createRole({ key, name });
      if (result.ok) {
        router.push(`/org/${orgSlug}/settings/roles`);
        router.refresh();
      } else {
        setError(result.error?.message ?? 'Failed to create role');
      }
    });
  }

  return (
    <Card className="max-w-lg">
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="role-key">Role Key</Label>
          <Input
            id="role-key"
            placeholder="e.g. manager, clerk, auditor"
            value={key}
            onChange={(e) => setKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '_'))}
          />
          <p className="text-xs text-muted-foreground">
            Unique identifier. Lowercase letters, numbers, hyphens, underscores only.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role-name">Display Name</Label>
          <Input
            id="role-name"
            placeholder="e.g. Manager, Clerk, Auditor"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isPending || !key || !name}
        >
          {isPending ? 'Creating...' : 'Create Role'}
        </Button>
      </CardFooter>
    </Card>
  );
}
