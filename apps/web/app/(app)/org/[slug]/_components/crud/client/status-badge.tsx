import { Badge } from 'afenda-ui/components/badge';

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  draft: { label: 'Draft', variant: 'secondary' },
  submitted: { label: 'Submitted', variant: 'default' },
  active: { label: 'Active', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  amended: { label: 'Amended', variant: 'outline' },
};

interface StatusBadgeProps {
  status: string | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;
  const config = STATUS_CONFIG[status] ?? { label: status, variant: 'outline' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
