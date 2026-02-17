'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from 'afenda-ui/components/breadcrumb';
import { Fragment } from 'react';

import { getBreadcrumbLabel } from './nav-config';

export function AppBreadcrumbs() {
  const pathname = usePathname();

  // Split: /org/[slug]/contacts/[id] → ['org', slug, 'contacts', id]
  const segments = pathname.split('/').filter(Boolean);

  // Skip 'org' and slug — breadcrumbs start after /org/[slug]/
  const orgIndex = segments.indexOf('org');
  const crumbSegments = orgIndex >= 0 ? segments.slice(orgIndex + 2) : segments;

  if (crumbSegments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Build cumulative paths for each segment
  const basePath = segments.slice(0, orgIndex + 2).join('/');

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbSegments.map((segment, index) => {
          const isLast = index === crumbSegments.length - 1;
          const href = `/${basePath}/${crumbSegments.slice(0, index + 1).join('/')}`;
          const label = getBreadcrumbLabel(segment);

          return (
            <Fragment key={href}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
