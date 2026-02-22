'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { UserButton } from '@neondatabase/auth/react/ui';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from 'afenda-ui/components/sidebar';

import { OrgSwitcher } from '@/app/components/org-switcher';

import { NAV_GROUPS } from './nav-config';

import type { OrgContextValue } from '@/app/providers/org-context';
import type { OrgListItem } from '@/lib/org';

interface AppSidebarProps {
  currentOrg: OrgContextValue;
  orgs: OrgListItem[];
}

export function AppSidebar({ currentOrg, orgs }: AppSidebarProps) {
  const pathname = usePathname();
  const slug = currentOrg.orgSlug;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrgSwitcher currentOrg={currentOrg} orgs={orgs} />
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const href = item.href(slug);
                  const isActive =
                    href === `/org/${slug}`
                      ? pathname === href
                      : pathname.startsWith(href);

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link href={href} aria-current={isActive ? 'page' : undefined}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <UserButton />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
