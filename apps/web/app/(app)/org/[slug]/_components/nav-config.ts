import { ArrowRightLeft, CalendarClock, FileText, GitBranch, Home, Settings, Trash2, Users } from 'lucide-react';

import {
  org,
  orgEntity,
  orgEntityTrash,
  orgSettings,
  orgSettingsCurrencyConverter,
  orgSettingsWorkingDay,
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
    label: 'Files',
    href: (slug) => orgEntity(slug, 'files'),
    icon: FileText,
    group: 'main',
  },
  {
    label: 'Video settings',
    href: (slug) => orgEntity(slug, 'video-settings'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Video settings',
  },
  {
    label: 'Tasks',
    href: (slug) => orgEntity(slug, 'tasks'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Tasks',
  },
  {
    label: 'Timesheets',
    href: (slug) => orgEntity(slug, 'timesheets'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Timesheets',
  },
  {
    label: 'Timesheet details',
    href: (slug) => orgEntity(slug, 'timesheet-details'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Timesheet details',
  },
  {
    label: 'Dependent tasks',
    href: (slug) => orgEntity(slug, 'dependent-tasks'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Dependent tasks',
  },
  {
    label: 'Activity types',
    href: (slug) => orgEntity(slug, 'activity-types'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Activity types',
  },
  {
    label: 'Activity costs',
    href: (slug) => orgEntity(slug, 'activity-costs'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Activity costs',
  },
  {
    label: 'Psoa projects',
    href: (slug) => orgEntity(slug, 'psoa-projects'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Psoa projects',
  },
  {
    label: 'Buying settings',
    href: (slug) => orgEntity(slug, 'buying-settings'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Buying settings',
  },
  {
    label: 'Designations',
    href: (slug) => orgEntity(slug, 'designations'),
    icon: Settings,
    group: 'main',
    commandPaletteAction: 'Open Designations',
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
  {
    label: 'Currency converter',
    href: (slug) => orgSettingsCurrencyConverter(slug),
    icon: ArrowRightLeft,
    group: 'system',
    commandPaletteAction: 'Open Currency converter',
  },
  {
    label: 'Working day',
    href: (slug) => orgSettingsWorkingDay(slug),
    icon: CalendarClock,
    group: 'system',
    commandPaletteAction: 'Open Working day',
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
 * Fallback labels for common sub-routes not in NAV_ITEMS.
 * NAV_ITEMS remains primary source (NAV-02); this map handles entity sub-pages.
 */
const SUB_ROUTE_LABELS: Record<string, string> = {
  edit: 'Edit',
  new: 'New',
  audit: 'Audit',
  versions: 'Versions',
  trash: 'Trash',
  instances: 'Instances',
  health: 'Health',
  approvals: 'Approvals',
  editor: 'Editor',
  roles: 'Roles',
  definition: 'Definition',
  definitionId: 'Definition',
  instanceId: 'Instance',
};

/**
 * Resolve breadcrumb label from a URL segment.
 * Primary: NAV_ITEMS. Fallback: SUB_ROUTE_LABELS. Last: title-cased segment.
 */
export function getBreadcrumbLabel(segment: string): string {
  const item = NAV_ITEMS.find((i) => {
    const parts = i.href('_').split('/');
    return parts[parts.length - 1] === segment;
  });
  if (item) return item.label;
  if (SUB_ROUTE_LABELS[segment]) return SUB_ROUTE_LABELS[segment];
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
