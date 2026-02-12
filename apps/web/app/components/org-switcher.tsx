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
import { Building2, Check, ChevronDown } from 'lucide-react';

import type { OrgContextValue } from '@/app/providers/org-context';
import type { OrgListItem } from '@/lib/org';

/**
 * Org switcher — dumb UI. Select org slug → navigate.
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

  function handleSwitch(slug: string) {
    if (slug !== currentOrg.orgSlug) {
      router.push(`/org/${slug}`);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Building2 className="h-4 w-4" />
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
            onClick={() => handleSwitch(org.orgSlug)}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 shrink-0 opacity-50" />
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
