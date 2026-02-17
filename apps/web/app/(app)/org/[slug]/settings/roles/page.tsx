import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from 'afenda-ui/components/badge';
import { Button } from 'afenda-ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'afenda-ui/components/card';
import { Plus, Shield, ShieldCheck } from 'lucide-react';

import { PageHeader } from '../../_components/crud/client/page-header';
import { getOrgContext } from '../../_server/org-context_server';

import { fetchRoles } from './_server/roles.query_server';

export default async function RolesListPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [rolesList, ctx] = await Promise.all([
    fetchRoles(),
    getOrgContext(slug),
  ]);

  if (!ctx) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Manage roles and their permissions for your organization"
      >
        <Button size="sm" asChild>
          <Link href={`/org/${slug}/settings/roles/new`}>
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Link>
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rolesList.map((role) => (
          <Link
            key={role.id}
            href={`/org/${slug}/settings/roles/${role.id}`}
            className="block"
          >
            <Card className="transition-colors hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    {role.isSystem ? (
                      <ShieldCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    )}
                    {role.name}
                  </CardTitle>
                  {role.isSystem && (
                    <Badge variant="secondary" className="text-xs">
                      System
                    </Badge>
                  )}
                </div>
                <CardDescription className="font-mono text-xs">
                  {role.key}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(role.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {rolesList.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No roles defined yet. Create your first role to get started.
          </div>
        )}
      </div>
    </div>
  );
}
