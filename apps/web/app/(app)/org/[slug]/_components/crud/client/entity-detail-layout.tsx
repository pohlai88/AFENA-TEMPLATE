import { Card, CardContent, CardHeader, CardTitle } from 'afenda-ui/components/card';
import { Separator } from 'afenda-ui/components/separator';

/**
 * EntityDetailLayout — 2-column detail page layout.
 * Header: title + StatusBadge + ActionBar (via children).
 * Main: info card(s). Sidebar: metadata card.
 * Server-compatible (no 'use client' needed).
 */

interface EntityDetailLayoutProps {
  /** Header row: title + badges + action bar */
  header: React.ReactNode;
  /** Main content area (left column) */
  main: React.ReactNode;
  /** Sidebar content (right column — metadata, links) */
  sidebar?: React.ReactNode;
  /** Optional bottom section (notes, tabs) */
  footer?: React.ReactNode;
}

export function EntityDetailLayout({
  header,
  main,
  sidebar,
  footer,
}: EntityDetailLayoutProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      {header}
      <Separator className="my-6" />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">{main}</div>
        {sidebar && <div>{sidebar}</div>}
      </div>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}

/**
 * MetadataCard — standard metadata sidebar card.
 */
interface MetadataCardProps {
  title?: string;
  children: React.ReactNode;
}

export function MetadataCard({ title = 'Metadata', children }: MetadataCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
