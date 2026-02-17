'use client';

import { Button } from 'afenda-ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'afenda-ui/components/dialog';
import { Input } from 'afenda-ui/components/input';
import { Label } from 'afenda-ui/components/label';
import { Textarea } from 'afenda-ui/components/textarea';
import { useState } from 'react';

import type { ResolvedAction } from 'afenda-canon';

interface ConfirmActionDialogProps {
  action: ResolvedAction | null;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export function ConfirmActionDialog({
  action,
  onConfirm,
  onCancel,
}: ConfirmActionDialogProps) {
  const [reason, setReason] = useState('');
  const [typedConfirm, setTypedConfirm] = useState('');

  const open = !!action;
  const needsReason = action?.requiresReason ?? false;
  const needsTypedConfirm = action?.requiresTypedConfirm;

  const canConfirm =
    (!needsReason || reason.trim().length > 0) &&
    (!needsTypedConfirm || typedConfirm === needsTypedConfirm);

  function handleConfirm() {
    onConfirm(needsReason ? reason : undefined);
    setReason('');
    setTypedConfirm('');
  }

  function handleCancel() {
    onCancel();
    setReason('');
    setTypedConfirm('');
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm {action?.label}</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>

        {needsTypedConfirm && (
          <div className="space-y-2">
            <Label htmlFor="typed-confirm">
              Type <span className="font-mono font-bold">{needsTypedConfirm}</span> to confirm
            </Label>
            <Input
              id="typed-confirm"
              value={typedConfirm}
              onChange={(e) => setTypedConfirm(e.target.value)}
              placeholder={needsTypedConfirm}
            />
          </div>
        )}

        {needsReason && (
          <div className="space-y-2">
            <Label htmlFor="action-reason">Reason (required)</Label>
            <Textarea
              id="action-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a reason for this action..."
              rows={3}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant={action?.variant ?? 'default'}
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            {action?.label}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
