'use client';

import { useRouter } from 'next/navigation';

import { Badge } from 'afena-ui/components/badge';
import { Button } from 'afena-ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'afena-ui/components/dropdown-menu';
import { Spinner } from 'afena-ui/components/spinner';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { authClient } from '@/lib/auth/client';

import type { OrgContextValue } from '@/app/providers/org-context';
import type { OrgListItem } from '@/lib/org';

/**
 * Org switcher — select org → setActive (updates JWT claim) → navigate.
 * Data is fetched server-side in OrgLayout and passed as props.
 */
export function OrgSwitcher({
  currentOrg,
  orgs,
}: {
  currentOrg: OrgContextValue;
  orgs: OrgListItem[];
}) {
  const router = useRouter();
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  function handleSwitch(orgId: string, slug: string) {
    if (slug === currentOrg.orgSlug || switchingId) return;

    setSwitchingId(orgId);
    authClient.organization
      .setActive({ organizationId: orgId })
      .catch(() => {
        // Best-effort — navigate anyway even if setActive fails
      })
      .finally(() => {
        router.push(`/org/${slug}`);
        setSwitchingId(null);
      });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2" disabled={!!switchingId}>
          {switchingId ? (
            <Spinner className="h-4 w-4" />
          ) : (
            <Building2 className="h-4 w-4" />
          )}
          <span className="max-w-[200px] truncate font-medium">
            {currentOrg.orgName}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {orgs.map((org) => (
          <DropdownMenuItem
            key={org.orgId}
            onClick={() => handleSwitch(org.orgId, org.orgSlug)}
            disabled={!!switchingId}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 truncate">
              {switchingId === org.orgId ? (
                <Spinner className="h-4 w-4 shrink-0" />
              ) : (
                <Building2 className="h-4 w-4 shrink-0 opacity-50" />
              )}
              <span className="truncate">{org.orgName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px]">
                {org.userRole}
              </Badge>
              {org.orgSlug === currentOrg.orgSlug && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
