'use client';

import { Button } from 'afenda-ui/components/button';
import {
  CheckCircle,
  Pencil,
  Plus,
  Send,
  Trash2,
  Undo2,
  XCircle,
} from 'lucide-react';

import type { ResolvedAction } from 'afenda-canon';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  plus: Plus,
  pencil: Pencil,
  'trash-2': Trash2,
  'undo-2': Undo2,
  send: Send,
  'x-circle': XCircle,
  'check-circle': CheckCircle,
};

interface ActionButtonProps {
  action: ResolvedAction;
  onClick: () => void;
  disabled?: boolean | undefined;
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ActionButton({
  action,
  onClick,
  disabled,
  size = 'sm',
}: ActionButtonProps) {
  const Icon = ICON_MAP[action.icon];

  return (
    <Button
      variant={action.variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {action.label}
    </Button>
  );
}
