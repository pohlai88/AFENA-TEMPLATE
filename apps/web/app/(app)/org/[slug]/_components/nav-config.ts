import { FileText, GitBranch, Home, Settings, Shield, Trash2, Users } from 'lucide-react';

import {
  org,
  orgEntity,
  orgEntityTrash,
  orgSettings,
  orgSettingsWorkflows,
} from '@/lib/routes/app-routes';

import type { LucideIcon } from 'lucide-react';

/**
 * Nav config — SSOT for sidebar labels, breadcrumb labels, and ⌘K actions.
 * Data only — no hooks, no 'use client'.
 */

export interface NavItem {
  label: string;
  href: (slug: string) => string;
  icon: LucideIcon;
  group: 'main' | 'system';
  commandPaletteAction?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: (slug) => org(slug),
    icon: Home,
    group: 'main',
  },
  {
    label: 'Contacts',
    href: (slug) => orgEntity(slug, 'contacts'),
    icon: Users,
    group: 'main',
    commandPaletteAction: 'Open Contacts',
  },
  {
    label: 'Advisories',
    href: (slug) => orgEntity(slug, 'advisories'),
    icon: Shield,
    group: 'main',
  },
  {
    label: 'Files',
    href: (slug) => orgEntity(slug, 'files'),
    icon: FileText,
    group: 'main',
  },
  // @entity-gen:nav-items
  {
    label: 'Trash',
    href: (slug) => orgEntityTrash(slug, 'contacts'),
    icon: Trash2,
    group: 'system',
    commandPaletteAction: 'Open Trash',
  },
  {
    label: 'Workflows',
    href: (slug) => orgSettingsWorkflows(slug),
    icon: GitBranch,
    group: 'system',
    commandPaletteAction: 'Open Workflows',
  },
  {
    label: 'Settings',
    href: (slug) => orgSettings(slug),
    icon: Settings,
    group: 'system',
  },
];

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Navigation',
    items: NAV_ITEMS.filter((i) => i.group === 'main'),
  },
  {
    label: 'System',
    items: NAV_ITEMS.filter((i) => i.group === 'system'),
  },
];

/**
 * Resolve breadcrumb label from a URL segment.
 * Falls back to title-cased segment if not in nav config.
 */
export function getBreadcrumbLabel(segment: string): string {
  const item = NAV_ITEMS.find((i) => {
    const parts = i.href('_').split('/');
    return parts[parts.length - 1] === segment;
  });
  if (item) return item.label;
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
