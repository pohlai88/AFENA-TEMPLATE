'use client';


import { Button } from 'afenda-ui/components/button';
import { Card, CardContent, CardFooter } from 'afenda-ui/components/card';
import { useActionState } from 'react';

/**
 * EntityFormShell — standard form wrapper using useActionState.
 * Handles pending state + server error display.
 * Children render the field components (RHF or native).
 */

export interface FormState {
  ok: boolean;
  error?: string;
}

const INITIAL_STATE: FormState = { ok: true };

interface EntityFormShellProps {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel?: string;
  onCancel?: () => void;
  children: React.ReactNode;
}

export function EntityFormShell({
  action,
  submitLabel = 'Save',
  onCancel,
  children,
}: EntityFormShellProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="space-y-4 pt-6">
          {!state.ok && state.error && (
            <div className="rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          {children}
        </CardContent>

        <CardFooter className="flex justify-between border-t px-6 py-4">
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={pending}
            >
              Cancel
            </Button>
          ) : (
            <div />
          )}
          <Button type="submit" disabled={pending}>
            {pending ? 'Saving...' : submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
