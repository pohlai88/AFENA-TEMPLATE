'use client';


import { Badge } from 'afenda-ui/components/badge';
import { Button } from 'afenda-ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from 'afenda-ui/components/dialog';
import { Label } from 'afenda-ui/components/label';
import { RadioGroup, RadioGroupItem } from 'afenda-ui/components/radio-group';
import { Textarea } from 'afenda-ui/components/textarea';
import { useState } from 'react';

import type { ResolvedUpdateMode } from 'afenda-canon';

interface UpdateModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modes: ResolvedUpdateMode[];
  onSelect: (mode: string, reason?: string) => void;
}

const SEVERITY_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  info: 'default',
  warning: 'secondary',
  critical: 'destructive',
};

export function UpdateModeDialog({
  open,
  onOpenChange,
  modes,
  onSelect,
}: UpdateModeDialogProps) {
  const [selected, setSelected] = useState<string>(modes[0]?.mode ?? '');
  const [reason, setReason] = useState('');

  const selectedMode = modes.find((m) => m.mode === selected);
  const needsReason = selectedMode?.requiresReason ?? false;

  function handleSubmit() {
    if (!selected) return;
    onSelect(selected, needsReason ? reason : undefined);
    setReason('');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Update Mode</DialogTitle>
          <DialogDescription>
            Select how you want to update this record.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={selected} onValueChange={setSelected} className="gap-3">
          {modes.map((mode) => (
            <div
              key={mode.mode}
              className="flex items-start gap-3 rounded-md border p-3"
            >
              <RadioGroupItem value={mode.mode} id={mode.mode} className="mt-0.5" />
              <div className="flex-1">
                <Label htmlFor={mode.mode} className="flex items-center gap-2 font-medium">
                  {mode.label}
                  <Badge variant={SEVERITY_VARIANT[mode.severity] ?? 'default'}>
                    {mode.severity}
                  </Badge>
                </Label>
                <p className="text-sm text-muted-foreground">{mode.description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>

        {needsReason && (
          <div className="space-y-2">
            <Label htmlFor="update-reason">Reason (required)</Label>
            <Textarea
              id="update-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why this change is needed..."
              rows={3}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selected || (needsReason && !reason.trim())}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
